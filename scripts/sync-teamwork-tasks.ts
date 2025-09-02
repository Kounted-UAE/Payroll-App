// scripts/sync-teamwork-tasks.ts
import dotenv from 'dotenv'
import fs from 'fs-extra'
import XLSX from 'xlsx'

// Load environment variables
dotenv.config()

// === CONFIGURATION ===
const TEAMWORK_SITE = process.env.TEAMWORK_SITE
const TEAMWORK_API_KEY = process.env.TEAMWORK_PROJECT_API_KEY
const EXCEL_FILE_PATH = './lib/all-tasks-source.xlsx'
const BATCH_SIZE = 10 // Process tasks in batches to respect rate limits
const DELAY_BETWEEN_BATCHES = 2000 // 2 seconds delay between batches
const DELAY_BETWEEN_REQUESTS = 500 // 500ms delay between individual requests

// Validate environment variables
if (!TEAMWORK_SITE || !TEAMWORK_API_KEY) {
  console.error('❌ Missing required environment variables:')
  console.error('- TEAMWORK_SITE=https://yoursite.teamwork.com')
  console.error('- TEAMWORK_PROJECT_API_KEY=your_api_key')
  console.error('\nPlease ensure these are set in your .env file.')
  process.exit(1)
}

// Types
interface ExcelTask {
  ID: number
  'Company name'?: string
  'Project'?: string
  'Description'?: string
  'Task list'?: string
  'Status'?: string
  'Task name'?: string
  'Due date'?: string | number
  'Assigned to'?: string
  'Created by'?: string
  'Date created'?: string | number
  'Progress'?: number
  'Priority'?: string | number
  'Time estimate'?: number
  'Tags'?: string
  'Priority text'?: string
  'Workflow Stages'?: string
}

interface TeamworkTask {
  id: number
  name: string
  description?: string
  dueDate?: string
  priority?: string
  status?: string
  progress?: number
  tagNames?: string[]
  [key: string]: any
}

interface SyncResults {
  updated: number
  skipped: number
  errors: number
  errorDetails: Array<{ taskId: number, error: string }>
}

// Rate limiting helper
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

// Teamwork API helper class
class TeamworkAPI {
  private baseUrl: string
  private headers: { [key: string]: string }

  constructor(site: string, apiKey: string) {
    // Ensure the site URL has https:// protocol
    let formattedSite = site
    if (!formattedSite.startsWith('http://') && !formattedSite.startsWith('https://')) {
      formattedSite = `https://${formattedSite}`
    }
    this.baseUrl = formattedSite.endsWith('/') ? formattedSite.slice(0, -1) : formattedSite
    this.headers = {
      'Authorization': `Basic ${Buffer.from(apiKey + ':xxx').toString('base64')}`,
      'Content-Type': 'application/json'
    }
  }

  async makeRequest(method: string, endpoint: string, data: any = null): Promise<any> {
    const url = `${this.baseUrl}/projects/api/v3${endpoint}`
    
    const options: RequestInit = {
      method,
      headers: this.headers
    }
    
    if (data && (method === 'POST' || method === 'PATCH')) {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      if (response.status === 204) return null
      return await response.json()
    } catch (error) {
      console.error(`❌ API Request failed: ${method} ${endpoint}`, error instanceof Error ? error.message : error)
      throw error
    }
  }

  async getTask(taskId: number): Promise<{ task: TeamworkTask } | null> {
    return await this.makeRequest('GET', `/tasks/${taskId}.json`)
  }

  async updateTask(taskId: number, taskData: Partial<TeamworkTask>): Promise<any> {
    return await this.makeRequest('PATCH', `/tasks/${taskId}.json`, { task: taskData })
  }
}

// Excel to Teamwork field mapping  
const FIELD_MAPPING: { [key: string]: string } = {
  'Task name': 'name',
  'Description': 'description',
  'Priority': 'priority',
  'Status': 'status',
  'Progress': 'progress'
  // Note: Due date and Tags need correct field names - temporarily disabled
  // 'Due date': 'dueDate',  
  // 'Tags': 'tagNames'
}

// Function to parse Excel data
function parseExcelData(filePath: string): ExcelTask[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Excel file not found: ${filePath}`)
  }

  console.log(`📂 Reading Excel file: ${filePath}`)
  
  const workbook = XLSX.readFile(filePath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(worksheet) as ExcelTask[]

  console.log(`📊 Found ${data.length} tasks in Excel file`)
  console.log(`📄 Using worksheet: ${sheetName}`)
  
  if (data.length > 0 && !('ID' in data[0])) {
    console.error('❌ Excel file must contain an "ID" column with Teamwork task IDs')
    console.log('Available columns:', Object.keys(data[0]))
    throw new Error('Missing required ID column')
  }

  if (data.length > 0) {
    console.log('📋 Available columns:', Object.keys(data[0]).join(', '))
  }

  return data
}

// Function to normalize date format
function normalizeDate(dateValue: string | number | Date | null | undefined): string | null {
  if (!dateValue) return null
  
  try {
    if (typeof dateValue === 'number') {
      // Excel date serial number
      const excelEpoch = new Date(1900, 0, 1)
      const date = new Date(excelEpoch.getTime() + (dateValue - 1) * 24 * 60 * 60 * 1000)
      return date.toISOString().split('T')[0]
    }
    
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue)
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0]
      }
    }
    
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0]
    }
  } catch (error) {
    console.warn(`⚠️ Could not parse date: ${dateValue}`)
  }
  
  return null
}

// Function to normalize priority
function normalizePriority(priorityValue: string | number | null | undefined): string | null {
  if (priorityValue === null || priorityValue === undefined) return null
  
  if (typeof priorityValue === 'string') {
    const lowerPriority = priorityValue.toLowerCase().trim()
    // Return text values that Teamwork expects
    const priorityMap: { [key: string]: string } = {
      'low': 'low', 'medium': 'medium', 'normal': 'medium', 'high': 'high', 'urgent': 'high', 'critical': 'high'
    }
    return priorityMap[lowerPriority] || 'medium' // default to medium if unknown
  }
  
  if (typeof priorityValue === 'number') {
    // Convert numbers to text priorities
    if (priorityValue <= 1) return 'low'
    if (priorityValue >= 3) return 'high'
    return 'medium'
  }
  
  return 'medium' // default fallback
}

// Function to detect changes
function detectChanges(excelRow: ExcelTask, teamworkTask: TeamworkTask): Partial<TeamworkTask> {
  const changes: Partial<TeamworkTask> = {}
  
  for (const [excelField, teamworkField] of Object.entries(FIELD_MAPPING)) {
    const excelValue = (excelRow as any)[excelField]
    const teamworkValue = teamworkTask[teamworkField]
    
    if (excelValue === null || excelValue === undefined || excelValue === '') continue
    
    let normalizedExcelValue: any = excelValue
    let normalizedTeamworkValue: any = teamworkValue
    
    switch (teamworkField) {
      case 'dueDate':
        normalizedExcelValue = normalizeDate(excelValue)
        normalizedTeamworkValue = teamworkValue ? teamworkValue.split('T')[0] : null
        break
      case 'priority':
        normalizedExcelValue = normalizePriority(excelValue)
        break
      case 'progress':
        if (typeof excelValue === 'string') {
          normalizedExcelValue = parseFloat(excelValue) || 0
        }
        normalizedExcelValue = Math.max(0, Math.min(100, normalizedExcelValue))
        break
      case 'tagNames':
        if (typeof excelValue === 'string') {
          normalizedExcelValue = excelValue.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        }
        break
      default:
        normalizedExcelValue = String(excelValue).trim()
        normalizedTeamworkValue = teamworkValue ? String(teamworkValue).trim() : ''
    }
    
    if (normalizedExcelValue !== null && normalizedExcelValue !== normalizedTeamworkValue) {
      changes[teamworkField] = normalizedExcelValue
      console.log(`  📝 Change detected in ${excelField}: "${normalizedTeamworkValue}" → "${normalizedExcelValue}"`)
    }
  }
  
  return changes
}

// Function to process a batch of tasks
async function processBatch(api: TeamworkAPI, tasks: ExcelTask[], batchNumber: number): Promise<SyncResults> {
  console.log(`\n📦 Processing batch ${batchNumber} (${tasks.length} tasks)...`)
  
  const results: SyncResults = {
    updated: 0, skipped: 0, errors: 0, errorDetails: []
  }
  
  for (const task of tasks) {
    try {
      const taskId = task.ID
      
      if (!taskId) {
        console.log(`  ⚠️ Skipping row without ID`)
        results.skipped++
        continue
      }
      
      console.log(`\n🔍 Checking task ${taskId}...`)
      
      const response = await api.getTask(taskId)
      const teamworkTask = response?.task
      
      if (!teamworkTask) {
        const error = `Task ${taskId} not found in Teamwork`
        console.log(`  ❌ ${error}`)
        results.errors++
        results.errorDetails.push({ taskId, error })
        continue
      }
      
      const changes = detectChanges(task, teamworkTask)
      
      if (Object.keys(changes).length === 0) {
        console.log(`  ✅ Task ${taskId} - No changes needed`)
        results.skipped++
      } else {
        console.log(`  🚀 Updating task ${taskId} with ${Object.keys(changes).length} changes...`)
        await api.updateTask(taskId, changes)
        console.log(`  ✅ Task ${taskId} updated successfully`)
        results.updated++
      }
      
      await sleep(DELAY_BETWEEN_REQUESTS)
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(`  ❌ Error processing task ${task.ID}:`, errorMessage)
      results.errors++
      results.errorDetails.push({ taskId: task.ID, error: errorMessage })
    }
  }
  
  return results
}

// Main sync function
async function syncTasksToTeamwork(): Promise<void> {
  console.log('🚀 Starting Excel to Teamwork sync...\n')
  console.log(`🔗 Teamwork Site: ${TEAMWORK_SITE}`)
  console.log(`📊 Batch Size: ${BATCH_SIZE}`)
  console.log(`⏱️ Delays: ${DELAY_BETWEEN_REQUESTS}ms between requests, ${DELAY_BETWEEN_BATCHES}ms between batches\n`)
  
  try {
    const api = new TeamworkAPI(TEAMWORK_SITE!, TEAMWORK_API_KEY!)
    const excelTasks = parseExcelData(EXCEL_FILE_PATH)
    
    if (excelTasks.length === 0) {
      console.log('📭 No tasks found in Excel file')
      return
    }
    
    console.log('\n📋 Preview of tasks to process:')
    excelTasks.slice(0, 3).forEach((task, index) => {
      console.log(`  ${index + 1}. ID: ${task.ID}, Name: "${task['Task name'] || 'N/A'}"`)
    })
    if (excelTasks.length > 3) {
      console.log(`  ... and ${excelTasks.length - 3} more tasks`)
    }
    
    const totalBatches = Math.ceil(excelTasks.length / BATCH_SIZE)
    let overallResults: SyncResults = { updated: 0, skipped: 0, errors: 0, errorDetails: [] }
    
    console.log(`\n🎯 Processing ${excelTasks.length} tasks in ${totalBatches} batches...\n`)
    
    for (let i = 0; i < totalBatches; i++) {
      const batchStart = i * BATCH_SIZE
      const batchEnd = Math.min(batchStart + BATCH_SIZE, excelTasks.length)
      const batch = excelTasks.slice(batchStart, batchEnd)
      
      const batchResults = await processBatch(api, batch, i + 1)
      
      overallResults.updated += batchResults.updated
      overallResults.skipped += batchResults.skipped
      overallResults.errors += batchResults.errors
      overallResults.errorDetails.push(...batchResults.errorDetails)
      
      console.log(`\n📊 Batch ${i + 1} Summary: ✅ ${batchResults.updated} updated, ⏭️ ${batchResults.skipped} skipped, ❌ ${batchResults.errors} errors`)
      
      if (i < totalBatches - 1) {
        console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`)
        await sleep(DELAY_BETWEEN_BATCHES)
      }
    }
    
    // Save error log if needed
    if (overallResults.errorDetails.length > 0) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const logFile = `./teamwork-sync-errors-${timestamp}.json`
      await fs.writeJSON(logFile, {
        timestamp: new Date().toISOString(),
        summary: {
          totalErrors: overallResults.errors,
          updated: overallResults.updated,
          skipped: overallResults.skipped,
          totalProcessed: excelTasks.length
        },
        errors: overallResults.errorDetails
      }, { spaces: 2 })
      console.log(`📄 Error details saved to: ${logFile}`)
    }
    
    // Final summary
    console.log('\n' + '='.repeat(60))
    console.log('📋 FINAL SYNC SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Tasks updated: ${overallResults.updated}`)
    console.log(`⏭️ Tasks skipped (no changes): ${overallResults.skipped}`)
    console.log(`❌ Tasks with errors: ${overallResults.errors}`)
    console.log(`📊 Total tasks processed: ${excelTasks.length}`)
    
    if (overallResults.updated > 0) {
      console.log(`📈 Success rate: ${((overallResults.updated / excelTasks.length) * 100).toFixed(1)}%`)
    }
    
    console.log('='.repeat(60))
    
    if (overallResults.errors > 0) {
      console.log('\n⚠️ Some tasks had errors. Please review the error log.')
      console.log('💡 Common issues:')
      console.log('   - Task IDs not found in Teamwork')
      console.log('   - Network connectivity issues')
      console.log('   - API rate limiting')
      console.log('   - Invalid field values')
    } else {
      console.log('\n🎉 Sync completed successfully!')
    }
    
  } catch (error) {
    console.error('💥 Fatal error during sync:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// Run the sync when this file is executed directly
syncTasksToTeamwork()
  .then(() => {
    console.log('\n👋 Sync process completed.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Unhandled error:', error)
    process.exit(1)
  })
