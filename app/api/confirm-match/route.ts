import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { MatchResult } from '@/lib/matching/matchTicketsQuotes'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createClient(process.env['NEXT_PUBLIC_SUPABASE_URL']!, process.env['SUPABASE_SERVICE_ROLE_KEY']!)
    
    // Handle both old and new match formats
    const match: Partial<MatchResult> & {
      ticketid: string
      quote_number: string | null
      invoice_number: string | null
      match_score: number
    } = body

    console.log('Confirming match:', {
      ticketid: match.ticketid,
      quote_number: match.quote_number,
      invoice_number: match.invoice_number,
      confidence: match.confidence,
      score: match.match_score
    })

    // Store the match with available fields
    // Note: Current schema doesn't support confidence/match_reasons fields
    // Consider adding these fields: confidence TEXT, match_reasons JSONB
    const matchData = {
      ticketid: match.ticketid,
      quote_number: match.quote_number,
      invoice_number: match.invoice_number,
      match_score: match.match_score,
      // Store confidence in status field for now (consider adding dedicated field)
      status: match.confidence ? `confirmed_${match.confidence}` : 'confirmed'
    }

    const { data, error } = await supabase
      .from('matches')
      .upsert(matchData, { 
        onConflict: 'ticketid,quote_number,invoice_number' 
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Optionally update temp tables with matched references
    // This helps with future matching and audit trails
    const updates: any[] = []

    if (match.quote_number) {
      updates.push(
        (supabase as any)
          .from('temp_quotes')
          .update({ matched_ticketid: match.ticketid })
          .eq('Number', match.quote_number)
      )
    }

    if (match.invoice_number) {
      updates.push(
        (supabase as any)
          .from('temp_invoices')
          .update({ 
            matched_ticketid: match.ticketid,
            matched_quote_number: match.quote_number 
          })
          .eq('Number', match.invoice_number)
      )
    }

    // Execute temp table updates
    if (updates.length > 0) {
      await Promise.all(updates)
    }

    console.log('Match confirmed successfully')

    return NextResponse.json({ 
      success: true, 
      match: data?.[0],
      message: 'Match confirmed and temp tables updated'
    })

  } catch (e) {
    console.error('Confirm match error:', e)
    return NextResponse.json({ 
      error: e instanceof Error ? e.message : 'Unknown error',
      details: e instanceof Error ? e.stack : undefined
    }, { status: 500 })
  }
}
