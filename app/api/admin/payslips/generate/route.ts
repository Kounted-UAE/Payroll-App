import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import puppeteer from 'puppeteer'
import crypto from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { generatePayslipPDFFallback } from '@/lib/utils/pdf/generatePayslipPDFFallback'
import { generatePayslipFilename } from '@/lib/utils/pdf/payslipNaming'

const STORAGE_BUCKET = 'generated-pdfs'
const STORAGE_FOLDER = 'payslips'
const TEMPLATE_PATH = path.join(process.cwd(), 'payslip-template.html')

function formatMoney(value: any, currencyCode: string) {
  if (value == null || isNaN(value)) return ''
  const safeCurrency = (currencyCode || 'AED').toUpperCase()
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: safeCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value))
}

function renderHtml(template: string, row: any) {
  const currency = (row.currency || 'AED') as string
  const inject = (label: string, value: any) =>
    value != null && value !== ''
      ? `<div class="box-line"><span>${label}</span><span>${formatMoney(value, currency)}</span></div>`
      : ''

  return template
    .replace('{{pay_period_from}}', row.pay_period_from || '')
    .replace('{{pay_period_to}}', row.pay_period_to || '')
    .replaceAll('{{employee_name}}', row.employee_name || '')
    .replaceAll('{{employer_name}}', row.employer_name || '')
    .replace('{{bank_name}}', row.bank_name || '-')
    .replace('{{iban}}', row.iban || '-')
    .replace('{{basic_salary}}', inject('Basic Salary & Wage', row.basic_salary))
    .replace('{{housing_allowance}}', inject('Housing Allowance', row.housing_allowance))
    .replace('{{transport_allowance}}', inject('Transport Allowance', row.transport_allowance))
    .replace('{{flight_allowance}}', inject('Flight Allowance', row.flight_allowance))
    .replace('{{education_allowance}}', inject('Education Allowance', row.education_allowance))
    .replace('{{general_allowance}}', inject('General Allowance', row.general_allowance))
    .replace('{{other_allowance}}', inject('Other Allowance', row.other_allowance))
    .replace('{{gratuity_eosb}}', inject('ESOP Adjustment', row.gratuity_eosb))
    .replace('{{total_gross_salary}}', inject('TOTAL EARNINGS', row.total_gross_salary))
    .replace('{{bonus}}', inject('Bonuses', row.bonus))
    .replace('{{overtime}}', inject('Overtime', row.overtime))
    .replace('{{salary_in_arrears}}', inject('Arrears/Advances', row.salary_in_arrears))
    .replace('{{expenses_deductions}}', inject('Expense Deductions', row.expenses_deductions))
    .replace('{{expense_reimbursements}}', inject('Expense Reimbursements', row.expense_reimbursements))
    .replace('{{other_reimbursements}}', inject('Other Reimbursements', row.other_reimbursements))
    .replaceAll('{{total_adjustments}}', inject('TOTAL ADJUSTMENTS', row.total_adjustments))
    .replace('{{net_salary}}', inject('NET', row.net_salary))
}

export async function POST(req: NextRequest) {
  try {
    console.log('Starting payslip generation API...')
    const supabase = getSupabaseServiceClient()
    const { batchIds } = await req.json().catch(() => ({ batchIds: [] }))
    
    if (!Array.isArray(batchIds) || batchIds.length === 0) {
      console.log('No batch IDs provided')
      return NextResponse.json({ error: 'batchIds required' }, { status: 400 })
    }
    
    console.log(`Processing ${batchIds.length} batch IDs:`, batchIds)

  const { data: rows, error } = await supabase
    .from('payroll_ingest_excelpayrollimport')
    .select('*')
    .in('batch_id', batchIds)

  if (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  console.log(`Found ${rows?.length || 0} rows to process`)

  // Check if template file exists
  try {
    await fs.access(TEMPLATE_PATH)
    console.log('Template file found at:', TEMPLATE_PATH)
  } catch (error) {
    console.error('Template file not found:', TEMPLATE_PATH, error)
    return NextResponse.json({ error: 'Template file not found' }, { status: 500 })
  }

  const template = await fs.readFile(TEMPLATE_PATH, 'utf8')
  console.log('Template loaded successfully, size:', template.length, 'characters')
  
  // Configure Puppeteer for production
  console.log('Launching Puppeteer browser...')
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
    ],
    timeout: 30000, // 30 second timeout
  })
  console.log('Browser launched successfully')
  
  const results: { batch_id: string; ok: boolean; message?: string }[] = []

  try {
    for (const row of rows ?? []) {
      const page = await browser.newPage()
      
      try {
        const html = renderHtml(template, row)
        await page.setContent(html, { 
          waitUntil: 'networkidle0',
          timeout: 10000 // 10 second timeout for page load
        })

        const pdfBuffer = await page.pdf({ 
          format: 'A4', 
          printBackground: true,
          timeout: 15000 // 15 second timeout for PDF generation
        })
        
        await page.close()

        // Use existing token if present, otherwise create new one
        const token = row.payslip_token || crypto.randomUUID()
        const filename = generatePayslipFilename(row.employee_name || 'unknown', token)
        const storagePath = `${STORAGE_FOLDER}/${filename}`

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
          })

        if (uploadError) {
          results.push({ batch_id: row.batch_id, ok: false, message: uploadError.message })
          continue
        }

        const { data: publicUrlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(storagePath)

        const publicUrl = publicUrlData?.publicUrl
        const { error: updateError } = await supabase
          .from('payroll_ingest_excelpayrollimport')
          .update({ payslip_url: publicUrl, payslip_token: token })
          .eq('batch_id', row.batch_id)

        if (updateError) {
          results.push({ batch_id: row.batch_id, ok: false, message: updateError.message })
        } else {
          results.push({ batch_id: row.batch_id, ok: true })
        }
      } catch (pageError) {
        console.error(`Error processing row ${row.batch_id} with Puppeteer:`, pageError)
        
        // Try fallback PDF generation
        try {
          console.log(`Attempting fallback PDF generation for ${row.batch_id}`)
          const fallbackPdf = await generatePayslipPDFFallback({
            employee: {
              id: row.batch_id,
              employee_name: row.employee_name || '',
              email_id: row.email_id,
              basic_salary: row.basic_salary,
              housing_allowance: row.housing_allowance,
              education_allowance: row.education_allowance,
              flight_allowance: row.flight_allowance,
              general_allowance: row.general_allowance,
              gratuity_eosb: row.gratuity_eosb,
              other_allowance: row.other_allowance,
              total_fixed_salary: row.total_gross_salary,
              bonus: row.bonus,
              overtime: row.overtime,
              salary_in_arrears: row.salary_in_arrears,
              expenses_deductions: row.expenses_deductions,
              other_reimbursements: row.other_reimbursements,
              expense_reimbursements: row.expense_reimbursements,
              total_variable_salary: row.total_adjustments,
              total_salary: row.net_salary,
              currency: (row.currency || 'AED') as string
            },
            batchData: {
              batch_id: row.batch_id,
              employer_name: row.employer_name || '',
              pay_period_from: row.pay_period_from || '',
              pay_period_to: row.pay_period_to || ''
            },
            language: 'english'
          })
          
          // Use existing token if present, otherwise create new one
          const token = row.payslip_token || crypto.randomUUID()
          const filename = generatePayslipFilename(row.employee_name || 'unknown', token)
          const storagePath = `${STORAGE_FOLDER}/${filename}`

          const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, fallbackPdf, {
              contentType: 'application/pdf',
              upsert: true,
            })

          if (uploadError) {
            results.push({ batch_id: row.batch_id, ok: false, message: `Fallback upload failed: ${uploadError.message}` })
          } else {
            const { data: publicUrlData } = supabase.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(storagePath)

            const publicUrl = publicUrlData?.publicUrl
            const { error: updateError } = await supabase
              .from('payroll_ingest_excelpayrollimport')
              .update({ payslip_url: publicUrl, payslip_token: token })
              .eq('batch_id', row.batch_id)

            if (updateError) {
              results.push({ batch_id: row.batch_id, ok: false, message: `Fallback update failed: ${updateError.message}` })
            } else {
              results.push({ batch_id: row.batch_id, ok: true, message: 'Generated using fallback method' })
            }
          }
        } catch (fallbackError) {
          console.error(`Fallback PDF generation also failed for ${row.batch_id}:`, fallbackError)
          results.push({ 
            batch_id: row.batch_id, 
            ok: false, 
            message: `Both Puppeteer and fallback failed: ${pageError instanceof Error ? pageError.message : 'Unknown error'}` 
          })
        }
        
        await page.close().catch(() => {}) // Ensure page is closed even on error
      }
    }
  } finally {
    await browser.close()
  }

  return NextResponse.json({ results })
  } catch (error) {
    console.error('Error in payslips generate API:', error)
    
    // If Puppeteer fails, try to provide more specific error information
    if (error instanceof Error) {
      if (error.message.includes('Could not find browser')) {
        return NextResponse.json({ 
          error: 'Browser not found. Please ensure Chrome/Chromium is installed in production environment.' 
        }, { status: 500 })
      }
      if (error.message.includes('timeout')) {
        return NextResponse.json({ 
          error: 'PDF generation timeout. The operation took too long to complete.' 
        }, { status: 500 })
      }
      if (error.message.includes('ENOENT')) {
        return NextResponse.json({ 
          error: 'Template file not found. Please ensure payslip-template.html exists in the project root.' 
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}


