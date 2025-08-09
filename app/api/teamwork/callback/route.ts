import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClientFromRequest } from '@/lib/supabase/server'
import { TEAMWORK_CLIENT_ID, TEAMWORK_CLIENT_SECRET, TEAMWORK_TOKEN_URL, TEAMWORK_REDIRECT_URI } from '@/lib/teamwork/client'

export async function GET(req: NextRequest) {
  const res = new NextResponse()
  const supabase = getSupabaseServerClientFromRequest(req, res)

  const code = req.nextUrl.searchParams.get('code')
  const stateRaw = req.nextUrl.searchParams.get('state')
  const state = stateRaw ? JSON.parse(decodeURIComponent(stateRaw)) : null
  const userId = state?.user_id
  if (!code || !userId) return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })

  try {
    const body = new URLSearchParams()
    body.set('grant_type', 'authorization_code')
    body.set('code', code)
    body.set('client_id', TEAMWORK_CLIENT_ID)
    body.set('client_secret', TEAMWORK_CLIENT_SECRET)
    body.set('redirect_uri', TEAMWORK_REDIRECT_URI)

    const resp = await fetch(TEAMWORK_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    })
    if (!resp.ok) {
      const text = await resp.text()
      console.error('Teamwork token exchange failed:', resp.status, text)
      return NextResponse.redirect(`${req.nextUrl.origin}/backyard/settings?teamwork_error=token_exchange_failed`)
    }
    const tokenJson: any = await resp.json()
    const accessToken: string | null = tokenJson.access_token ?? null
    const refreshToken: string | null = tokenJson.refresh_token ?? null
    const expiresIn: number | null = tokenJson.expires_in ?? null
    const now = new Date()
    const expiresAt = expiresIn ? new Date(now.getTime() + expiresIn * 1000).toISOString() : null

    await supabase.from('teamwork_connections').upsert(
      {
        id: userId,
        user_id: userId,
        name: 'Teamwork Connection',
        email: '',
        access_token: accessToken,
        refresh_token: refreshToken,
        token_expires_at: expiresAt,
        updated_at: now.toISOString(),
      },
      { onConflict: 'id' }
    )
  } catch (e) {
    console.error('Teamwork callback error:', e)
    return NextResponse.redirect(`${req.nextUrl.origin}/backyard/settings?teamwork_error=callback_failed`)
  }

  return NextResponse.redirect(`${req.nextUrl.origin}/backyard/settings?teamwork_connected=1`)
}
