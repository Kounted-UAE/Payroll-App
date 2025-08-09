// lib/teamwork/client.ts
export const TEAMWORK_AUTHORIZE_URL = process.env.TEAMWORK_AUTHORIZE_URL || 'https://www.teamwork.com/launchpad/login'
export const TEAMWORK_TOKEN_URL = process.env.TEAMWORK_TOKEN_URL || 'https://www.teamwork.com/launchpad/v1/token.json'

export const TEAMWORK_CLIENT_ID = process.env.TEAMWORK_CLIENT_ID || ''
export const TEAMWORK_CLIENT_SECRET = process.env.TEAMWORK_CLIENT_SECRET || ''
export const TEAMWORK_REDIRECT_URI = process.env.TEAMWORK_REDIRECT_URI || ''

export function buildTeamworkAuthorizeUrl(state: string) {
  const url = new URL(TEAMWORK_AUTHORIZE_URL)
  url.searchParams.set('client_id', TEAMWORK_CLIENT_ID)
  url.searchParams.set('redirect_uri', TEAMWORK_REDIRECT_URI)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('state', state)
  return url.toString()
}
