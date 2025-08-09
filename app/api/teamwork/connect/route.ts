import { NextRequest, NextResponse } from 'next/server'
import { buildTeamworkAuthorizeUrl } from '@/lib/teamwork/client'

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id')
  if (!userId) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
  const state = encodeURIComponent(JSON.stringify({ user_id: userId }))
  const url = buildTeamworkAuthorizeUrl(state)
  return NextResponse.redirect(url)
}
