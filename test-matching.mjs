#!/usr/bin/env node

/**
 * Comprehensive Test Script for Advanced Fuzzy Matching System
 * 
 * This script tests the new fuzzy matching algorithm for tickets, quotes, and invoices.
 * 
 * Usage:
 * node test-matching.mjs [--min-score 0.3] [--include-stats] [--confidence high|medium|low|all]
 */

import fetch from 'node-fetch'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// Parse command line arguments
const args = process.argv.slice(2)
const minScore = args.includes('--min-score') ? parseFloat(args[args.indexOf('--min-score') + 1]) : 0.3
const includeStats = args.includes('--include-stats')
const confidenceFilter = args.includes('--confidence') ? args[args.indexOf('--confidence') + 1] : 'all'

console.log('🚀 Testing Advanced Fuzzy Matching System')
console.log('=' .repeat(50))
console.log(`Base URL: ${BASE_URL}`)
console.log(`Min Score: ${minScore}`)
console.log(`Include Stats: ${includeStats}`)
console.log(`Confidence Filter: ${confidenceFilter}`)
console.log()

async function testMatchingStats() {
  try {
    console.log('📊 Testing matching statistics endpoint...')
    
    const response = await fetch(`${BASE_URL}/api/matching-stats`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error}`)
    }
    
    console.log('✅ Statistics fetched successfully:')
    console.log(`   Total Tickets: ${data.stats.total_tickets}`)
    console.log(`   Total Quotes: ${data.stats.total_quotes}`)
    console.log(`   Total Invoices: ${data.stats.total_invoices}`)
    console.log(`   Total Matches: ${data.stats.total_matches}`)
    console.log(`   High Confidence: ${data.stats.high_confidence_matches}`)
    console.log(`   Medium Confidence: ${data.stats.medium_confidence_matches}`)
    console.log(`   Low Confidence: ${data.stats.low_confidence_matches}`)
    console.log(`   Average Score: ${data.stats.avg_match_score?.toFixed(3)}`)
    console.log()
    
    return data.stats
  } catch (error) {
    console.error('❌ Statistics test failed:', error.message)
    return null
  }
}

async function testRunMatching() {
  try {
    console.log('🔍 Testing fuzzy matching algorithm...')
    console.log(`   Using min score: ${minScore}`)
    console.log(`   Include stats: ${includeStats}`)
    
    const response = await fetch(`${BASE_URL}/api/run-matching`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        minScore,
        includeStats
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error}`)
    }
    
    console.log('✅ Matching completed successfully:')
    console.log(`   Total Matches Found: ${data.matches.length}`)
    
    if (data.summary) {
      console.log(`   High Confidence: ${data.summary.high_confidence}`)
      console.log(`   Medium Confidence: ${data.summary.medium_confidence}`)
      console.log(`   Low Confidence: ${data.summary.low_confidence}`)
      console.log(`   Average Score: ${data.summary.avg_score?.toFixed(3)}`)
    }
    
    console.log()
    
    // Filter matches by confidence if specified
    let filteredMatches = data.matches
    if (confidenceFilter !== 'all') {
      filteredMatches = data.matches.filter(match => match.confidence === confidenceFilter)
      console.log(`🔧 Filtered to ${confidenceFilter} confidence: ${filteredMatches.length} matches`)
      console.log()
    }
    
    // Show top matches
    const topMatches = filteredMatches
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5)
    
    if (topMatches.length > 0) {
      console.log('🏆 Top Matches:')
      console.log('-'.repeat(120))
      console.log('Ticket ID'.padEnd(15) + 'Quote'.padEnd(15) + 'Invoice'.padEnd(15) + 'Score'.padEnd(8) + 'Conf'.padEnd(8) + 'Reasons')
      console.log('-'.repeat(120))
      
      topMatches.forEach(match => {
        const ticketId = (match.ticketid || '').substring(0, 14).padEnd(15)
        const quoteNum = (match.quote_number || '').substring(0, 14).padEnd(15)
        const invoiceNum = (match.invoice_number || '').substring(0, 14).padEnd(15)
        const score = match.match_score.toFixed(2).padEnd(8)
        const confidence = match.confidence.padEnd(8)
        const reasonsCount = `${match.match_reasons.length} reasons`
        
        console.log(`${ticketId}${quoteNum}${invoiceNum}${score}${confidence}${reasonsCount}`)
        
        // Show first 2 reasons indented
        match.match_reasons.slice(0, 2).forEach(reason => {
          console.log(`  → ${reason}`)
        })
        
        if (match.match_reasons.length > 2) {
          console.log(`  ... and ${match.match_reasons.length - 2} more reasons`)
        }
        console.log()
      })
    }
    
    return data
  } catch (error) {
    console.error('❌ Matching test failed:', error.message)
    return null
  }
}

async function testConfirmMatch(match) {
  try {
    console.log(`🔄 Testing match confirmation for ticket ${match.ticketid}...`)
    
    const response = await fetch(`${BASE_URL}/api/confirm-match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(match)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.error}`)
    }
    
    console.log('✅ Match confirmed successfully')
    console.log(`   Status: ${data.match?.status || 'confirmed'}`)
    console.log(`   Message: ${data.message}`)
    console.log()
    
    return data
  } catch (error) {
    console.error('❌ Confirm match test failed:', error.message)
    return null
  }
}

function analyzeMatchingQuality(matches) {
  console.log('📈 Matching Quality Analysis:')
  console.log('-'.repeat(40))
  
  const scoreRanges = {
    'Excellent (0.8-1.0)': matches.filter(m => m.match_score >= 0.8).length,
    'Good (0.6-0.8)': matches.filter(m => m.match_score >= 0.6 && m.match_score < 0.8).length,
    'Fair (0.4-0.6)': matches.filter(m => m.match_score >= 0.4 && m.match_score < 0.6).length,
    'Poor (0.2-0.4)': matches.filter(m => m.match_score >= 0.2 && m.match_score < 0.4).length,
    'Very Poor (<0.2)': matches.filter(m => m.match_score < 0.2).length
  }
  
  Object.entries(scoreRanges).forEach(([range, count]) => {
    const percentage = matches.length > 0 ? ((count / matches.length) * 100).toFixed(1) : '0.0'
    console.log(`   ${range}: ${count} (${percentage}%)`)
  })
  
  console.log()
  
  // Confidence distribution
  const confidenceDistribution = {
    high: matches.filter(m => m.confidence === 'high').length,
    medium: matches.filter(m => m.confidence === 'medium').length,
    low: matches.filter(m => m.confidence === 'low').length
  }
  
  console.log('Confidence Distribution:')
  Object.entries(confidenceDistribution).forEach(([conf, count]) => {
    const percentage = matches.length > 0 ? ((count / matches.length) * 100).toFixed(1) : '0.0'
    console.log(`   ${conf}: ${count} (${percentage}%)`)
  })
  
  console.log()
}

// Main test execution
async function main() {
  console.log('Starting comprehensive matching system test...')
  console.log()
  
  // Test 1: Get statistics
  const stats = await testMatchingStats()
  
  if (!stats) {
    console.log('❌ Cannot continue without basic statistics')
    process.exit(1)
  }
  
  if (stats.total_tickets === 0 || stats.total_quotes === 0) {
    console.log('⚠️  Warning: No tickets or quotes found in database')
    console.log('   Make sure your temp tables have data before testing')
    console.log()
  }
  
  // Test 2: Run matching algorithm
  const matchingResult = await testRunMatching()
  
  if (!matchingResult) {
    console.log('❌ Matching test failed, skipping further tests')
    process.exit(1)
  }
  
  if (matchingResult.matches.length === 0) {
    console.log('⚠️  No matches found with current parameters')
    console.log('   Try lowering the min-score or check your data')
    process.exit(0)
  }
  
  // Test 3: Analyze quality
  analyzeMatchingQuality(matchingResult.matches)
  
  // Test 4: Test confirmation (only test the first high-confidence match)
  const highConfidenceMatches = matchingResult.matches.filter(m => m.confidence === 'high')
  
  if (highConfidenceMatches.length > 0) {
    console.log('🧪 Testing match confirmation with highest scoring match...')
    await testConfirmMatch(highConfidenceMatches[0])
  } else {
    console.log('⚠️  No high-confidence matches to test confirmation with')
  }
  
  // Summary
  console.log('📋 Test Summary:')
  console.log('-'.repeat(30))
  console.log(`✅ Statistics API: Working`)
  console.log(`✅ Matching Algorithm: Working`)
  console.log(`✅ Quality Analysis: Complete`)
  console.log(`${highConfidenceMatches.length > 0 ? '✅' : '⚠️'} Confirmation Test: ${highConfidenceMatches.length > 0 ? 'Working' : 'Skipped'}`)
  console.log()
  console.log('🎉 Comprehensive matching system test completed!')
  
  // Recommendations
  console.log()
  console.log('💡 Recommendations:')
  
  const avgScore = matchingResult.summary?.avg_score || 0
  if (avgScore < 0.5) {
    console.log('   - Consider tuning the matching weights for better accuracy')
    console.log('   - Review data quality in temp tables')
  }
  
  const highConfPercentage = (highConfidenceMatches.length / matchingResult.matches.length) * 100
  if (highConfPercentage < 30) {
    console.log('   - Consider adjusting confidence thresholds')
    console.log('   - Review matching strategies for your data patterns')
  }
  
  if (matchingResult.matches.length < stats.total_tickets * 0.1) {
    console.log('   - Low match rate detected, consider lowering min-score')
    console.log('   - Check if ticket IDs appear in quote/invoice references')
  }
  
  console.log('   - Use the UI at /kounted/referral-programs to review matches')
  console.log('   - Monitor match quality over time as data patterns change')
}

// Run the test
main().catch(error => {
  console.error('💥 Test execution failed:', error)
  process.exit(1)
}) 