import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return NextResponse.json({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') || '200')
  const offset = Number(searchParams.get('offset') || '0')
  const sortBy = searchParams.get('sortBy') || ''
  const sortDir = (searchParams.get('sortDir') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc'

  const supabase = createClient(url, key)

  const from = offset
  const to = offset + limit - 1

  // Whitelist sortable columns to avoid SQL injection
  const sortable: Record<string, true> = {
    created_at: true,
    pay_period_to: true,
    employer_name: true,
    employee_name: true,
    reviewer_email: true,
    email_id: true,
  }

  let query = supabase
    .from('payroll_ingest_excelpayrollimport')
    .select('batch_id, employer_name, employee_name, reviewer_email, email_id, payslip_url, payslip_token, created_at, pay_period_to', { count: 'exact' })
    .range(from, to)

  if (sortBy && sortable[sortBy]) {
    query = query.order(sortBy, { ascending: sortDir === 'asc', nullsFirst: sortDir === 'asc' })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ rows: data ?? [], total: count ?? 0 })
}
