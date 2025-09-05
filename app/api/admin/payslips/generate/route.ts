import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import puppeteer from 'puppeteer'
import crypto from 'crypto'
import fs from 'fs/promises'

const STORAGE_BUCKET = 'generated-pdfs'
const STORAGE_FOLDER = 'payslips'
const TEMPLATE_PATH = './payslip-template.html'

function formatMoney(value: any) {
  if (value == null || isNaN(value)) return ''
  return Number(value).toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function renderHtml(template: string, row: any) {
  const inject = (label: string, value: any) =>
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
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: 'Missing Supabase env' }, { status: 500 })

  const supabase = createClient(url, key)
  const { batchIds } = await req.json().catch(() => ({ batchIds: [] }))
  if (!Array.isArray(batchIds) || batchIds.length === 0) {
    return NextResponse.json({ error: 'batchIds required' }, { status: 400 })
  }

  const { data: rows, error } = await supabase
    .from('payroll_ingest_excelpayrollimport')
    .select('*')
    .in('batch_id', batchIds)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const template = await fs.readFile(TEMPLATE_PATH, 'utf8')
  const browser = await puppeteer.launch()
  const results: { batch_id: string; ok: boolean; message?: string }[] = []

  try {
    for (const row of rows ?? []) {
      const page = await browser.newPage()
      const html = renderHtml(template, row)
      await page.setContent(html, { waitUntil: 'networkidle0' })

      const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })
      await page.close()

      // Use existing token if present, otherwise create new one
      const token = row.payslip_token || crypto.randomUUID()
      const storagePath = `${STORAGE_FOLDER}/${token}.pdf`

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
    }
  } finally {
    await browser.close()
  }

  return NextResponse.json({ results })
}


