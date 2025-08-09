import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClientFromRequest } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const res = new NextResponse()
  const supabase = getSupabaseServerClientFromRequest(req, res)

  const code = req.nextUrl.searchParams.get('code')
  const stateRaw = req.nextUrl.searchParams.get('state')
  const state = stateRaw ? JSON.parse(decodeURIComponent(stateRaw)) : null
  const userId = state?.user_id
  if (!code || !userId) return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })

  // Exchange code for token (Teamwork docs: App Login Flow; token endpoint varies; expecting JSON response)
  // Implement once exact endpoints are confirmed via env
  // Placeholder: mark connection created without token exchange for now

  const now = new Date().toISOString()
  await supabase.from('teamwork_connections').upsert(
    {
      id: userId, // or a generated id; storing by user simplifies 1:1
      user_id: userId,
      name: 'Teamwork Connection',
      email: '',
      access_token: '',
      refresh_token: null,
      token_expires_at: null,
      created_at: now,
      updated_at: now,
    },
    { onConflict: 'id' }
  )

  return NextResponse.redirect(`${req.nextUrl.origin}/backyard/settings`)
}
