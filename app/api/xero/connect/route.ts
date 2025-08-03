import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClientFromRequest } from '@/lib/supabase/server'
import { xero } from '@/lib/xero/xero'

export async function GET(req: NextRequest) {
  const res = new NextResponse()
  const supabase = getSupabaseServerClientFromRequest(req, res)

   const userId = req.nextUrl.searchParams.get('user_id')
if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })

const state = encodeURIComponent(JSON.stringify({ user_id: userId }))
const consentUrl = xero.buildConsentUrl()
return NextResponse.redirect(`${consentUrl}&state=${state}`)

}
