// sb-diagnose.mjs
import 'dotenv/config'
import dns from 'dns/promises'
import https from 'https'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const { SUPABASE_SERVICE_ROLE_KEY } = process.env

console.log('Node:', process.version)
console.log('URL:', SUPABASE_URL)

try {
  const host = new URL(SUPABASE_URL).host
  const addrs = await dns.lookup(host, { all: true })
  console.log('DNS:', addrs)
} catch (e) {
  console.error('DNS lookup failed:', e)
}

const get = (url, headers = {}) =>
  new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: 'GET',
        headers,
        timeout: 15000, // 15s
      },
      (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () =>
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() })
        )
      }
    )
    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy(new Error('Timeout'))
    })
    req.end()
  })

try {
  // Auth health: no auth needed
  const health = await get(`${SUPABASE_URL}/auth/v1/health`)
  console.log('auth/v1/health:', health.status, health.body)
} catch (e) {
  console.error('auth health fetch failed:', e)
}

try {
  // REST ping: requires API key
  const rest = await get(`${SUPABASE_URL}/rest/v1/`, {
    apikey: SUPABASE_SERVICE_ROLE_KEY ?? '',
    authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY ?? ''}`,
  })
  console.log('rest/v1/ root:', rest.status, rest.body.slice(0, 200))
} catch (e) {
  console.error('rest fetch failed:', e)
}
