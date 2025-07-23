// lib/auth/client.ts

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/types/supabase"

const supabaseBrowser = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function signInWithOTP(email: string) {
  const { error } = await supabaseBrowser.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  })
  return { error }
}

export async function verifyOTP(email: string, token: string) {
  const { data, error } = await supabaseBrowser.auth.verifyOtp({
    email,
    token,
    type: "email",
  })
  return { ...data, error }
}
