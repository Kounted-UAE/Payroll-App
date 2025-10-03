import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseServiceClient()

  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') || '200')
  const offset = Number(searchParams.get('offset') || '0')
  const sortBy = searchParams.get('sortBy') || ''
  const sortDir = (searchParams.get('sortDir') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc'

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
      currency: true,
      net_salary: true,
    }

    let query = supabase
      .from('payroll_excel_imports')
      .select('id, employer_name, employee_name, reviewer_email, email_id, payslip_url, payslip_token, created_at, pay_period_to, currency, net_salary', { count: 'exact' })
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

    // Map id to batch_id for backward compatibility with frontend
    const rowsWithBatchId = (data || []).map((r: any) => ({ 
      ...r, 
      batch_id: r.id  // Map id to batch_id for frontend compatibility
    }))

    // Attach last_sent_at from events table (best-effort)
    let lastSentMap: Record<string, string> = {}
    try {
      const ids = (data || []).map((r: any) => r.id).filter(Boolean)
      if (ids.length > 0) {
        const { data: events, error: eventsError } = await supabase
          .from('payroll_payslip_send_events')
          .select('batch_id, created_at')
          .in('batch_id', ids)
          .order('created_at', { ascending: false })

        if (!eventsError && Array.isArray(events)) {
          for (const e of events) {
            if (!lastSentMap[e.batch_id]) {
              lastSentMap[e.batch_id] = e.created_at
            }
          }
        }
      }
    } catch {}

    const rowsWithLast = rowsWithBatchId.map((r: any) => ({ ...r, last_sent_at: lastSentMap[r.id] || null }))

    return NextResponse.json({ rows: rowsWithLast, total: count ?? 0 })
  } catch (error) {
    console.error('Error in payslips list API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
