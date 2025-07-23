// lib/supabase/client.ts

import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/lib/types/supabase"

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      storage: localStorage, // critical for persistent login across reloads
    },
  }
)
