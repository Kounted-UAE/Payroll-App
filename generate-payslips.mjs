import dotenv from 'dotenv'
import fs from 'fs-extra'
import path from 'path'
import puppeteer from 'puppeteer'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

dotenv.config()

// === CONFIGURATION ===
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const OUTPUT_DIR = './payslips'
const TEMPLATE_FILE = './payslip-template.html'
const TABLE_NAME = 'payroll_ingest_excelpayrollimport'
const STORAGE_BUCKET = 'generated-pdfs'
const STORAGE_FOLDER = 'payslips'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const sanitize = (str) =>
  str?.toString().replace(/[^a-z0-9]/gi, '_').substring(0, 64) || 'unknown'

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
      : '';

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
    .replaceAll('{{total_adjustments}}', inject('TOTAL ADJUSTMENTS', row.total_variable_values))

    // Net Total
    .replace('{{net_salary}}', inject('NET', row.net_salary));
}

const main = async () => {
  try {
    await fs.ensureDir(OUTPUT_DIR)
    const template = await fs.readFile(TEMPLATE_FILE, 'utf8')

    const { data: rows, error } = await supabase
      .from(TABLE_NAME)
      .select('*')

    if (error) throw new Error(`Supabase query failed: ${error.message}`)
    if (!rows?.length) {
      console.warn('⚠️ No rows found. Exiting.')
      return
    }

    const browser = await puppeteer.launch()

    for (const row of rows) {
      const page = await browser.newPage()
      const html = injectTemplate(template, row)

      await page.setContent(html, { waitUntil: 'networkidle0' })

      const token = crypto.randomUUID()
      const filename = `${token}.pdf`
      const tempPath = path.join(OUTPUT_DIR, filename)
      const storagePath = `${STORAGE_FOLDER}/${filename}`

      // Generate PDF locally
      await page.pdf({ path: tempPath, format: 'A4', printBackground: true })
      await page.close()

      const fileBuffer = await fs.readFile(tempPath)

      const { error: uploadError } = await supabase
        .storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, fileBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        })

      if (uploadError) {
        console.error(`❌ Upload failed for ${filename}:`, uploadError.message)
        continue
      }

      const { data: publicUrlData } = supabase
        .storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(storagePath)

      const publicUrl = publicUrlData?.publicUrl

      const { error: updateError } = await supabase
        .from(TABLE_NAME)
        .update({ payslip_url: publicUrl, payslip_token: token })
        .eq('batch_id', row.batch_id)

      if (updateError) {
        console.error(`❌ Failed to update row for ${row.employee_name}:`, updateError.message)
      } else {
        console.log(`✅ Uploaded + linked PDF for ${row.employee_name}`)
      }

      await fs.remove(tempPath)
    }

    await browser.close()
    console.log('🎉 All payslips uploaded and linked.')
  } catch (err) {
    console.error('❌ Script failed:', err.message)
    process.exit(1)
  }
}

main()
