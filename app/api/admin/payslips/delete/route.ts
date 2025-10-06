import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseServiceClient()
    const body = await request.json().catch(() => ({}))
    const ids = Array.isArray(body?.ids) ? body.ids : []

    if (!ids.length) {
      return NextResponse.json({ error: 'ids array required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('payroll_excel_imports')
      .delete()
      .in('id', ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, deleted: ids.length })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal server error' }, { status: 500 })
  }
}


