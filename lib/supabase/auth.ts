// lib/supabase/auth.ts

import { getSupabaseClient } from "./client"

export async function signInWithOTP(email: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  })
  return { error }
}

export async function verifyOTP(email: string, token: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  })
  return { ...data, error }
}
