import { NextResponse } from 'next/server'
import { getMatchingStats } from '@/lib/matching/matchTicketsQuotes'

export async function GET() {
  try {
    console.log('Fetching matching statistics...')
    
    const stats = await getMatchingStats()
    
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