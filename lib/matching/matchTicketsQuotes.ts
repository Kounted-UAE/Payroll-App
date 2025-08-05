// /lib/matching/matchTicketsQuotes.ts

import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/supabase'

// Add a function to get the server client
function getSupabaseServerClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return undefined // We'll handle cookies differently for API routes
        },
        set(name: string, value: string, options: any) {
          // Not needed for this use case
        },
        remove(name: string, options: any) {
          // Not needed for this use case
        },
      },
    }
  )
}

// === FUZZY MATCHING UTILITIES ===

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      )
    }
  }
  
  return matrix[str2.length][str1.length]
}

/**
 * Calculate similarity score between two strings (0-1, where 1 is identical)
 */
function stringSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0
  
  const s1 = str1.toLowerCase().trim()
  const s2 = str2.toLowerCase().trim()
  
  if (s1 === s2) return 1
  
  const maxLength = Math.max(s1.length, s2.length)
  if (maxLength === 0) return 1
  
  const distance = levenshteinDistance(s1, s2)
  return (maxLength - distance) / maxLength
}

/**
 * Check if one string contains another with fuzzy matching
 */
function fuzzyContains(haystack: string, needle: string, threshold = 0.8): number {
  if (!haystack || !needle) return 0
  
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase()
  
  // Exact substring match
  if (h.includes(n)) return 1
  
  // Fuzzy substring matching - slide the needle through the haystack
  let bestScore = 0
  const needleLen = n.length
  
  for (let i = 0; i <= h.length - needleLen; i++) {
    const substr = h.substring(i, i + needleLen)
    const score = stringSimilarity(substr, n)
    bestScore = Math.max(bestScore, score)
  }
  
  return bestScore >= threshold ? bestScore : 0
}

/**
 * Extract potential IDs and references from text
 */
function extractIdentifiers(text: string): string[] {
  if (!text) return []
  
  // Match patterns like: ticket123, T-123, #123, 123456, etc.
  const patterns = [
    /\b[A-Z]*\d{3,}\b/g,           // Letters followed by 3+ digits
    /\b[A-Z]+-\d+\b/g,            // Letter-dash-digits
    /\b[A-Z]+\d+\b/g,             // Letters followed by digits
    /\b\d{4,}\b/g,                // 4+ digit numbers
    /#\d+/g,                      // Hash followed by digits
  ]
  
  const identifiers = new Set<string>()
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(match => identifiers.add(match.toLowerCase()))
    }
  })
  
  return Array.from(identifiers)
}

/**
 * Calculate date proximity score (closer dates = higher score)
 */
function dateProximityScore(date1: string | null, date2: string | null): number {
  if (!date1 || !date2) return 0
  
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0
  
  const diffDays = Math.abs((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24))
  
  // Score decreases with time difference
  if (diffDays === 0) return 1
  if (diffDays <= 1) return 0.9
  if (diffDays <= 7) return 0.7
  if (diffDays <= 30) return 0.5
  if (diffDays <= 90) return 0.3
  
  return 0.1
}

// === MATCHING STRATEGIES ===

interface MatchScore {
  score: number
  reasons: string[]
  confidence: 'high' | 'medium' | 'low'
}

interface TicketData {
  ticketid: string
  subject: string | null
  firstmessage: string | null
  customerid: number | null
  createdat: string | null
  tags: string | null
}

interface QuoteData {
  Number: string
  Reference: string | null
  Customer: string | null
  Amount: number | null
  'Issue date': string | null
  Status: string | null
  ticketid: string | null
}

interface InvoiceData {
  Number: string
  Ref: string | null
  To: string | null
  Date: string | null
  Status: string | null
  ticketid: string | null
  quoteref: string | null
}

/**
 * Match ticket to quote using multiple strategies
 */
function matchTicketToQuote(ticket: TicketData, quote: QuoteData): MatchScore {
  const reasons: string[] = []
  let totalScore = 0
  let maxPossibleScore = 0
  
  // Strategy 1: Direct ticket ID match (highest priority)
  maxPossibleScore += 40
  if (quote.ticketid && quote.ticketid === ticket.ticketid) {
    totalScore += 40
    reasons.push(`Exact ticket ID match: ${ticket.ticketid}`)
  } else if (quote.ticketid && stringSimilarity(quote.ticketid, ticket.ticketid) > 0.8) {
    const score = stringSimilarity(quote.ticketid, ticket.ticketid) * 35
    totalScore += score
    reasons.push(`Fuzzy ticket ID match: ${ticket.ticketid} ≈ ${quote.ticketid} (${(score/35*100).toFixed(1)}%)`)
  }
  
  // Strategy 2: Reference field matching
  maxPossibleScore += 30
  if (quote.Reference) {
    const containsScore = fuzzyContains(quote.Reference, ticket.ticketid)
    if (containsScore > 0) {
      const score = containsScore * 30
      totalScore += score
      reasons.push(`Ticket ID found in quote reference: "${quote.Reference}" (${(score/30*100).toFixed(1)}%)`)
    }
    
    // Check for other identifiers in the ticket subject/message
    const ticketText = `${ticket.subject || ''} ${ticket.firstmessage || ''}`.toLowerCase()
    const quoteIdentifiers = extractIdentifiers(quote.Reference)
    const ticketIdentifiers = extractIdentifiers(ticketText)
    
    for (const qId of quoteIdentifiers) {
      for (const tId of ticketIdentifiers) {
        const sim = stringSimilarity(qId, tId)
        if (sim > 0.8) {
          const score = sim * 15
          totalScore += score
          reasons.push(`Cross-reference match: ${tId} ≈ ${qId} (${(sim*100).toFixed(1)}%)`)
          break
        }
      }
    }
  }
  
  // Strategy 3: Customer name matching (if we have customer info)
  maxPossibleScore += 20
  if (quote.Customer && ticket.subject) {
    const customerSim = stringSimilarity(quote.Customer, ticket.subject)
    if (customerSim > 0.6) {
      const score = customerSim * 20
      totalScore += score
      reasons.push(`Customer name similarity: "${quote.Customer}" ≈ "${ticket.subject}" (${(customerSim*100).toFixed(1)}%)`)
    }
  }
  
  // Strategy 4: Quote number in ticket content
  maxPossibleScore += 15
  const ticketContent = `${ticket.subject || ''} ${ticket.firstmessage || ''}`.toLowerCase()
  if (ticketContent.includes(quote.Number.toLowerCase())) {
    totalScore += 15
    reasons.push(`Quote number found in ticket content: ${quote.Number}`)
  } else {
    const quoteContainsScore = fuzzyContains(ticketContent, quote.Number, 0.7)
    if (quoteContainsScore > 0) {
      const score = quoteContainsScore * 15
      totalScore += score
      reasons.push(`Quote number fuzzy match in ticket: ${quote.Number} (${(quoteContainsScore*100).toFixed(1)}%)`)
    }
  }
  
  // Strategy 5: Date proximity (if available)
  maxPossibleScore += 10
  if (quote['Issue date'] && ticket.createdat) {
    const dateScore = dateProximityScore(quote['Issue date'], ticket.createdat)
    if (dateScore > 0) {
      const score = dateScore * 10
      totalScore += score
      reasons.push(`Date proximity match (${(dateScore*100).toFixed(1)}%)`)
    }
  }
  
  const finalScore = maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0
  
  let confidence: 'high' | 'medium' | 'low'
  if (finalScore >= 0.8) confidence = 'high'
  else if (finalScore >= 0.5) confidence = 'medium'
  else confidence = 'low'
  
  return {
    score: finalScore,
    reasons,
    confidence
  }
}

/**
 * Match quote to invoice using multiple strategies
 */
function matchQuoteToInvoice(quote: QuoteData, invoice: InvoiceData): MatchScore {
  const reasons: string[] = []
  let totalScore = 0
  let maxPossibleScore = 0
  
  // Strategy 1: Quote reference in invoice
  maxPossibleScore += 40
  if (invoice.quoteref && invoice.quoteref === quote.Number) {
    totalScore += 40
    reasons.push(`Exact quote reference match: ${quote.Number}`)
  } else if (invoice.quoteref && stringSimilarity(invoice.quoteref, quote.Number) > 0.8) {
    const score = stringSimilarity(invoice.quoteref, quote.Number) * 35
    totalScore += score
    reasons.push(`Fuzzy quote reference match: ${quote.Number} ≈ ${invoice.quoteref}`)
  }
  
  // Strategy 2: Quote number in invoice Ref field
  maxPossibleScore += 35
  if (invoice.Ref) {
    const containsScore = fuzzyContains(invoice.Ref, quote.Number)
    if (containsScore > 0) {
      const score = containsScore * 35
      totalScore += score
      reasons.push(`Quote number found in invoice ref: "${invoice.Ref}"`)
    }
  }
  
  // Strategy 3: Customer/To field matching
  maxPossibleScore += 20
  if (quote.Customer && invoice.To) {
    const customerSim = stringSimilarity(quote.Customer, invoice.To)
    if (customerSim > 0.7) {
      const score = customerSim * 20
      totalScore += score
      reasons.push(`Customer name match: "${quote.Customer}" ≈ "${invoice.To}"`)
    }
  }
  
  // Strategy 4: Date proximity
  maxPossibleScore += 10
  if (quote['Issue date'] && invoice.Date) {
    const dateScore = dateProximityScore(quote['Issue date'], invoice.Date)
    if (dateScore > 0) {
      const score = dateScore * 10
      totalScore += score
      reasons.push(`Date proximity match`)
    }
  }
  
  const finalScore = maxPossibleScore > 0 ? totalScore / maxPossibleScore : 0
  
  let confidence: 'high' | 'medium' | 'low'
  if (finalScore >= 0.8) confidence = 'high'
  else if (finalScore >= 0.5) confidence = 'medium'
  else confidence = 'low'
  
  return {
    score: finalScore,
    reasons,
    confidence
  }
}

// === MAIN MATCHING FUNCTION ===

export interface MatchResult {
  ticketid: string
  ticket_subject?: string
  quote_number: string | null
  quote_customer?: string
  invoice_number: string | null
  invoice_to?: string
  match_score: number
  confidence: 'high' | 'medium' | 'low'
  match_reasons: string[]
  ticket_quote_score?: number
  quote_invoice_score?: number
}

export async function findTicketQuoteMatches(minScore = 0.3): Promise<MatchResult[]> {
  const supabase = getSupabaseServerClient()
  
  // Fetch all data with comprehensive field selection
  const [ticketsResult, quotesResult, invoicesResult] = await Promise.all([
    supabase.from('temp_tickets').select('ticketid,subject,firstmessage,customerid,createdat,tags'),
    supabase.from('temp_quotes').select('Number,Reference,Customer,Amount,"Issue date",Status,ticketid'),
    supabase.from('temp_invoices').select('Number,Ref,To,Date,Status,ticketid,quoteref')
  ])
  
  const tickets = ticketsResult.data || []
  const quotes = quotesResult.data || []
  const invoices = invoicesResult.data || []
  
  console.log(`Processing ${tickets.length} tickets, ${quotes.length} quotes, ${invoices.length} invoices`)
  
  const matches: MatchResult[] = []
  const processedPairs = new Set<string>()
  
  // Primary matching: Ticket -> Quote -> Invoice
  for (const ticket of tickets) {
    const ticketMatches: Array<{
      quote: QuoteData
      score: MatchScore
      invoice?: InvoiceData
      invoiceScore?: MatchScore
    }> = []
    
    // Find matching quotes for this ticket
    for (const quote of quotes) {
      const matchScore = matchTicketToQuote(ticket, quote)
      
      if (matchScore.score >= minScore) {
        // Look for invoice that matches this quote
        let bestInvoice: InvoiceData | undefined
        let bestInvoiceScore: MatchScore | undefined
        
        for (const invoice of invoices) {
          const invoiceScore = matchQuoteToInvoice(quote, invoice)
          
          if (invoiceScore.score >= minScore) {
            if (!bestInvoiceScore || invoiceScore.score > bestInvoiceScore.score) {
              bestInvoice = invoice
              bestInvoiceScore = invoiceScore
            }
          }
        }
        
        ticketMatches.push({
          quote,
          score: matchScore,
          invoice: bestInvoice,
          invoiceScore: bestInvoiceScore
        })
      }
    }
    
    // Sort by combined score (ticket-quote + quote-invoice)
    ticketMatches.sort((a, b) => {
      const scoreA = a.score.score + (a.invoiceScore?.score || 0)
      const scoreB = b.score.score + (b.invoiceScore?.score || 0)
      return scoreB - scoreA
    })
    
    // Create match results
    for (const match of ticketMatches) {
      const pairKey = `${ticket.ticketid}-${match.quote.Number}`
      if (processedPairs.has(pairKey)) continue
      processedPairs.add(pairKey)
      
      const combinedScore = match.score.score + (match.invoiceScore?.score || 0)
      const allReasons = [
        ...match.score.reasons,
        ...(match.invoiceScore?.reasons || [])
      ]
      
      // Determine overall confidence
      let overallConfidence: 'high' | 'medium' | 'low'
      if (match.score.confidence === 'high' && (match.invoiceScore?.confidence === 'high' || !match.invoiceScore)) {
        overallConfidence = 'high'
      } else if (match.score.confidence === 'medium' || match.invoiceScore?.confidence === 'medium') {
        overallConfidence = 'medium'
      } else {
        overallConfidence = 'low'
      }
      
      matches.push({
        ticketid: ticket.ticketid,
        ticket_subject: ticket.subject || undefined,
        quote_number: match.quote.Number,
        quote_customer: match.quote.Customer || undefined,
        invoice_number: match.invoice?.Number || null,
        invoice_to: match.invoice?.To || undefined,
        match_score: Math.min(combinedScore, 1.0), // Cap at 1.0
        confidence: overallConfidence,
        match_reasons: allReasons,
        ticket_quote_score: match.score.score,
        quote_invoice_score: match.invoiceScore?.score
      })
    }
  }
  
  // Secondary matching: Direct quote-invoice matches without tickets
  for (const quote of quotes) {
    for (const invoice of invoices) {
      const pairKey = `quote-${quote.Number}-invoice-${invoice.Number}`
      if (processedPairs.has(pairKey)) continue
      
      const invoiceScore = matchQuoteToInvoice(quote, invoice)
      
      if (invoiceScore.score >= minScore) {
        processedPairs.add(pairKey)
        
        matches.push({
          ticketid: quote.ticketid || `quote-${quote.Number}`,
          quote_number: quote.Number,
          quote_customer: quote.Customer || undefined,
          invoice_number: invoice.Number,
          invoice_to: invoice.To || undefined,
          match_score: invoiceScore.score,
          confidence: invoiceScore.confidence,
          match_reasons: invoiceScore.reasons,
          quote_invoice_score: invoiceScore.score
        })
      }
    }
  }
  
  // Sort all matches by score (highest first)
  matches.sort((a, b) => b.match_score - a.match_score)
  
  console.log(`Found ${matches.length} potential matches`)
  
  return matches
}

/**
 * Get match statistics for analysis
 */
export async function getMatchingStats() {
  const supabase = getSupabaseServerClient()
  
  const [ticketsResult, quotesResult, invoicesResult] = await Promise.all([
    supabase.from('temp_tickets').select('ticketid', { count: 'exact' }),
    supabase.from('temp_quotes').select('Number', { count: 'exact' }),
    supabase.from('temp_invoices').select('Number', { count: 'exact' })
  ])
  
  const matches = await findTicketQuoteMatches(0.1) // Lower threshold for stats
  
  return {
    total_tickets: ticketsResult.count || 0,
    total_quotes: quotesResult.count || 0,
    total_invoices: invoicesResult.count || 0,
    total_matches: matches.length,
    high_confidence_matches: matches.filter(m => m.confidence === 'high').length,
    medium_confidence_matches: matches.filter(m => m.confidence === 'medium').length,
    low_confidence_matches: matches.filter(m => m.confidence === 'low').length,
    avg_match_score: matches.length > 0 ? matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length : 0
  }
}
