// app/kounted/page.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function KountedHome() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to payroll page immediately
    router.replace('/kounted/payroll')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-zinc-600">Redirecting to payroll...</p>
      </div>
    </div>
  )
}
