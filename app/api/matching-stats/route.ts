import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    error: 'Matching functionality has been deprecated',
    message: 'This feature is no longer available'
  }, { status: 410 })
} 