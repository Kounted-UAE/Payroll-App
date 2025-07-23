// lib/supabase/server.ts

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/lib/types/supabase"

const COOKIE_NAME = "sb"

export const supabase = createServerClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: cookies(),
  }
)

export { createServerClient }

// --- Helpers ---

export type VAuthenticatedProfile = Database["public"]["Views"]["v_authenticated_profiles"]["Row"]

export async function getSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(`${COOKIE_NAME}-${name}`)?.value
        },
      },
    }
  )
}

export async function getAuthenticatedProfile(): Promise<VAuthenticatedProfile | null> {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) return null

  const { data: profile, error: profileError } = await supabase
    .from("v_authenticated_profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError || !profile?.is_active) return null
  return profile
}

export async function getUserRoleSlug() {
  const profile = await getAuthenticatedProfile()
  return profile?.role_slug ?? null
}

export async function isSuperAdmin() {
  const slug = await getUserRoleSlug()
  return slug === "kounted-superadmin"
}

export async function isClientRole() {
  const slug = await getUserRoleSlug()
  return slug?.startsWith("client-") ?? false
}

export async function isStaffRole() {
  const slug = await getUserRoleSlug()
  return slug?.startsWith("kounted-") && slug !== "kounted-superadmin"
}
