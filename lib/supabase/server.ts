// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/supabase'
import type { NextRequest, NextResponse } from 'next/server'

// Type for the v_authenticated_profiles view
export type VAuthenticatedProfile = Database['public']['Views']['v_authenticated_profiles']['Row']

export function getSupabaseServerClientFromRequest(
  req: NextRequest,
  res: NextResponse
) {
  return createServerClient<Database>(
    process.env['NEXT_PUBLIC_SUPABASE_URL']!,
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          res.cookies.set(name, value, options)
        },
        remove(name, options) {
          res.cookies.set(name, '', { ...options, maxAge: -1 })
        },
      },
    }
  )
}

// For API routes that need service role access
export function getSupabaseServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey)
}
