// hooks/useUserRole.ts

"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/types/supabase"

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function useUserRole(userId: string | undefined) {
  const [role, setRole] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchProfile = async () => {
      setLoading(true)

      const { data, error } = await supabase
        .from("public_user_profiles")
        .select("*, public_user_roles(*)")
        .eq("user_id", userId)
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setProfile(data)
     setRole(data.public_user_roles?.role_slug || null)
      setLoading(false)
    }

    fetchProfile()
  }, [userId])

  return { role, profile, loading, error }
}
