// app/api/xero/sync/invoices/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { xero } from '@/lib/xero/xero'
import { getSupabaseServerClientFromRequest } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const res = new NextResponse()

  try {
    const supabase = getSupabaseServerClientFromRequest(req, res)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (!user || userError) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const { data: tokenRow, error: tokenError } = await supabase
      .from('xero_auth_tokens')
      .select('access_token, refresh_token, tenant_id')
      .eq('user_id', user.id)
      .single()

    if (tokenError || !tokenRow?.tenant_id) {
      return NextResponse.json({ error: 'No valid Xero token or tenant ID found' }, { status: 403 })
    }

    await xero.setTokenSet({
      access_token: tokenRow.access_token ?? '',
      refresh_token: tokenRow.refresh_token ?? '',
      expires_at: 0, // force refresh
    })
    await xero.updateTenants()

    const tenantId = tokenRow.tenant_id
    const { body: { invoices = [] } } = await xero.accountingApi.getInvoices(tenantId)

    const mapped = invoices.map((inv: any) => ({
      xero_invoice_id: inv.invoiceID,
      invoice_number: inv.invoiceNumber,
      contact_name: inv.contact?.name ?? null,
      email_address: inv.contact?.emailAddress ?? null,
      issue_date: inv.date ?? null,
      due_date: inv.dueDate ?? null,
      currency: inv.currencyCode ?? null,
      subtotal: inv.subTotal ?? null,
      tax_amount: inv.totalTax ?? null,
      total: inv.total ?? null,
      status: inv.status ?? null,
      type: inv.type ?? null,
      synced_at: new Date().toISOString(),
      tenant_id: tenantId,
      source_data: inv,
    }))

    const { error: insertError } = await supabase
      .from('source_xero_invoices')
      .upsert(mapped, { onConflict: 'xero_invoice_id,tenant_id' })

    if (insertError) {
      console.error('❌ Insert failed:', insertError)
      return NextResponse.json({ error: 'Insert failed', details: insertError }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: mapped.length })
  } catch (err: any) {
    console.error('❌ Invoice sync error:', err)
    return NextResponse.json({ error: 'Unexpected error', message: err.message }, { status: 500 })
  }
}
