// components/auth/auth-provider.tsx

"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { Session, SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/types/supabase"
import type { VAuthenticatedProfile } from "@/lib/supabase/server"

type AuthContextType = {
  session: Session | null
  supabase: SupabaseClient<Database>
  profile: VAuthenticatedProfile | null
  loading: boolean
  roleSlug: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<VAuthenticatedProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      setSession(currentSession)
      
      if (currentSession?.user?.id) {
        const { data, error } = await (supabase as any)
          .from("v_authenticated_profiles")
          .select("*")
          .eq("id", currentSession.user.id)
          .maybeSingle();

        if (!error && data) {
          setProfile(data as VAuthenticatedProfile);
        }
      }

      setLoading(false)
    }

    getSessionAndProfile()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <AuthContext.Provider
      value={{
        supabase,
        session,
        profile,
        loading,
        roleSlug: profile?.role_slug ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
