// generate-payslips.mjs
import 'dotenv/config'
import fs from 'fs-extra'
import path from 'path'
import puppeteer from 'puppeteer'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// === CONFIGURATION ===
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OUTPUT_DIR = process.env.OUTPUT_DIR || './payslips'
const TEMPLATE_FILE = process.env.TEMPLATE_FILE || './payslip-template.html'
const TABLE_NAME = process.env.TABLE_NAME || 'payroll_ingest_excelpayrollimport'
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'generated-pdfs'
const STORAGE_FOLDER = process.env.STORAGE_FOLDER || 'payslips'

// If your bucket is NOT public, set SIGNED_URLS=true (value is seconds to expire, e.g., 60*60*24 for 1 day)
const SIGNED_URLS = Number(process.env.SIGNED_URLS || '0') // 0 = use public URLs

// Initialize Supabase for server-side scripts with the new secret key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    headers: {
      'x-client-info': 'kounted-payslip-generator/1.0',
    },
  },
})

const formatMoney = (value) => {
  if (value == null || isNaN(value)) return ''
  return Number(value).toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const injectTemplate = (template, row) => {
  const inject = (label, value) =>
    value != null && value !== ''
      ? `<div class="box-line"><span>${label}</span><span>${formatMoney(value)} AED</span></div>`
      : ''

  return template
    .replace('{{pay_period_from}}', row.pay_period_from || '')
    .replace('{{pay_period_to}}', row.pay_period_to || '')
    .replaceAll('{{employee_name}}', row.employee_name || '')
    .replaceAll('{{employer_name}}', row.employer_name || '')
    .replace('{{bank_name}}', row.bank_name || '-')
    .replace('{{iban}}', row.iban || '-')

    // Monthly Earnings
    .replace('{{basic_salary}}', inject('Basic Salary & Wage', row.basic_salary))
    .replace('{{housing_allowance}}', inject('Housing Allowance', row.housing_allowance))
    .replace('{{transport_allowance}}', inject('Transport Allowance', row.transport_allowance))
    .replace('{{flight_allowance}}', inject('Flight Allowance', row.flight_allowance))
    .replace('{{education_allowance}}', inject('Education Allowance', row.education_allowance))
    .replace('{{general_allowance}}', inject('General Allowance', row.general_allowance))
    .replace('{{other_allowance}}', inject('Other Allowance', row.other_allowance))
    .replace('{{gratuity_eosb}}', inject('ESOP Adjustment', row.gratuity_eosb))
    .replace('{{total_gross_salary}}', inject('TOTAL EARNINGS', row.total_gross_salary))

    // Adjustments
    .replace('{{bonus}}', inject('Bonuses', row.bonus))
    .replace('{{overtime}}', inject('Overtime', row.overtime))
    .replace('{{salary_in_arrears}}', inject('Arrears/Advances', row.salary_in_arrears))
    .replace('{{expenses_deductions}}', inject('Expense Deductions', row.expenses_deductions))
    .replace('{{expense_reimbursements}}', inject('Expense Reimbursements', row.expense_reimbursements))
    .replace('{{other_reimbursements}}', inject('Other Reimbursements', row.other_reimbursements))
    .replaceAll('{{total_adjustments}}', inject('TOTAL ADJUSTMENTS', row.total_adjustments))

    // Net Total
    .replace('{{net_salary}}', inject('NET', row.net_salary))
}

const fetchTargetRows = async () => {
  // We want rows where payslip_url is NULL or '' (empty string).
  // Using a clear OR across fully qualified predicates avoids ambiguity.
  const query = supabase.from(TABLE_NAME).select('*')
    .or('payslip_url.is.null,payslip_url.eq.')

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

const ensureDirs = async () => {
  await fs.ensureDir(OUTPUT_DIR)
}

const readTemplate = async () => {
  const resolved = path.isAbsolute(TEMPLATE_FILE)
    ? TEMPLATE_FILE
    : path.join(__dirname, TEMPLATE_FILE)
  return fs.readFile(resolved, 'utf8')
}

const uploadPdf = async (storagePath, fileBuffer) => {
  const { error } = await supabase
    .storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })
  if (error) throw error
}

const getUrlForPath = async (storagePath) => {
  if (SIGNED_URLS > 0) {
    const { data, error } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(storagePath, SIGNED_URLS)
    if (error) throw error
    return data.signedUrl
  } else {
    const { data } = supabase
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath)
    return data?.publicUrl ?? null
  }
}

const updateRow = async (row, publicUrl, token) => {
  // WARNING: batch_id usually isn’t unique. If you have a PK column (e.g., id), prefer updating by that.
  const matchColumn = process.env.UPDATE_MATCH_COLUMN || 'batch_id'
  const matchValue = row[matchColumn]
  if (matchValue === undefined) {
    throw new Error(`Match column ${matchColumn} not found on row`)
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ payslip_url: publicUrl, payslip_token: token })
    .eq(matchColumn, matchValue)

  if (error) throw error
}

const main = async () => {
  console.log('🔍 Environment check:')
  console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing')

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables')
    process.exit(1)
  }

  await ensureDirs()
  const template = await readTemplate()

  console.log('🔍 Querying Supabase table:', TABLE_NAME, '…')
  const rows = await fetchTargetRows()
  console.log(`✅ Query successful, found ${rows.length} rows needing payslips`)

  if (rows.length === 0) return

  const browser = await puppeteer.launch({
    // add args below if running in sandboxed CI
    // args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    for (const row of rows) {
      const page = await browser.newPage()
      const html = injectTemplate(template, row)
      await page.setContent(html, { waitUntil: 'networkidle0' })

      const token = crypto.randomUUID()
      const filename = `${token}.pdf`
      const tempPath = path.join(OUTPUT_DIR, filename)
      const storagePath = `${STORAGE_FOLDER}/${filename}`

      await page.pdf({ path: tempPath, format: 'A4', printBackground: true })
      await page.close()

      const fileBuffer = await fs.readFile(tempPath)
      await uploadPdf(storagePath, fileBuffer)

      const url = await getUrlForPath(storagePath)

      await updateRow(row, url, token)

      console.log(`✅ Uploaded + linked PDF for ${row.employee_name ?? 'employee'} → ${url}`)
      await fs.remove(tempPath)
    }
  } finally {
    await browser.close()
  }

  console.log('🎉 All payslips uploaded and linked.')
}

main().catch((err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})
