import { NextResponse } from 'next/server'
import { xero } from '@/lib/xero/xero'

export async function GET() {
  const url = await xero.buildConsentUrl()
  return NextResponse.redirect(url)
}
