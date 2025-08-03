import { NextRequest, NextResponse } from 'next/server'
import { findTicketQuoteMatches, getMatchingStats } from '@/lib/matching/matchTicketsQuotes'

export async function POST(req: NextRequest) {
  try {
    // Optionally accept minScore from request body for custom filtering
    const body = await req.json().catch(() => ({}))
    const { minScore, includeStats } = body
    
    console.log(`Starting matching process with minScore: ${minScore || 0.3}`)
    
    // Run the matching algorithm
    const matches = await findTicketQuoteMatches(minScore || 0.3)
    
    // Optionally include statistics
    let stats = null
    if (includeStats) {
      stats = await getMatchingStats()
    }
    
    console.log(`Matching completed. Found ${matches.length} matches`)
    
    return NextResponse.json({ 
      matches,
      stats,
      summary: {
        total_matches: matches.length,
        high_confidence: matches.filter(m => m.confidence === 'high').length,
        medium_confidence: matches.filter(m => m.confidence === 'medium').length,
        low_confidence: matches.filter(m => m.confidence === 'low').length,
        avg_score: matches.length > 0 ? matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length : 0
      }
    })
  } catch (e) {
    console.error('Matching error:', e)
    return NextResponse.json({ 
      error: e instanceof Error ? e.message : 'Unknown error',
      details: e instanceof Error ? e.stack : undefined
    }, { status: 500 })
  }
}

// GET endpoint for quick stats without running full matching
export async function GET() {
  try {
    const stats = await getMatchingStats()
    return NextResponse.json({ stats })
  } catch (e) {
    console.error('Stats error:', e)
    return NextResponse.json({ 
      error: e instanceof Error ? e.message : 'Unknown error' 
    }, { status: 500 })
  }
}
