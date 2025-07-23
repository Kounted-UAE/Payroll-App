//app/page.tsx

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"


export default function HomePage() {  
const router = useRouter()
const { profile, loading } = useAuth()

useEffect(() => {
  if (!loading) {
    if (profile) {
      router.push("/dashboard")
    } else {
      router.push("/auth/login")
    }
  }
}, [profile, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return null
}
