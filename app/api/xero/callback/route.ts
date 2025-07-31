// app/api/xero/callback/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { xero } from '@/lib/xero/xero'

export async function GET(req: NextRequest) {
  try {
    const callbackUrl = req.nextUrl.href
    
    await xero.apiCallback(callbackUrl)
    await xero.updateTenants()

    console.log('✅ Xero auth success')
    console.log('Tenants:', xero.tenants)

    return NextResponse.redirect(`${req.nextUrl.origin}/backyard/admin/xero-config`)
  } catch (err) {
    console.error('❌ Xero callback failed:', err?.response?.data || err.message || err)
    return NextResponse.json({ error: 'Xero auth failed' }, { status: 500 })
  }
}
