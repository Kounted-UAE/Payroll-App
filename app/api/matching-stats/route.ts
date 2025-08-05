import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/supabase'

// Move the matching logic here or create a separate function that accepts the client
async function getMatchingStatsWithClient() {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return undefined
        },
        set(name: string, value: string, options: any) {
          // Not needed
        },
        remove(name: string, options: any) {
          // Not needed
        },
      },
    }
  )
  
  // Implement the stats logic here using the supabase client
  // ... rest of the logic
}

export async function GET() {
  try {
    console.log('Fetching matching statistics...')
    
    const stats = await getMatchingStatsWithClient()
    
    console.log('Statistics fetched successfully:', stats)
    
    return NextResponse.json({ 
      success: true,
      stats,
      timestamp: new Date().toISOString()
    })
  } catch (e) {
    console.error('Stats error:', e)
    return NextResponse.json({ 
      error: e instanceof Error ? e.message : 'Unknown error',
      details: e instanceof Error ? e.stack : undefined
    }, { status: 500 })
  }
} 