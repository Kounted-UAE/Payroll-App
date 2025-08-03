// app/backyard/admin/temp-payrun-history/page.tsx

'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import XeroStatCards from '@/components/admin/XeroStatCards'
import  XeroSectionHeader from '@/components/admin/XeroTabSectionHeader'
import XeroTabTableInvoices from '@/components/admin/XeroTabTableInvoices'
import XeroSearchBar from '@/components/admin/XeroSearchBar'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function XeroConfigPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Xero Config</h1>

        <button
          className="border rounded bg-blue-400 text-white px-4 py-2 text-sm hover:bg-muted"
          onClick={() => {
            window.location.href = '/api/xero/connect'
          }}
        >
          Connect Xero
        </button>
       
    const result = await res.json()
    if (result.success) {
      alert(`✅ Synced ${result.count} invoices.`)
      location.reload() // or trigger a query refetch if using React Query
    } else {
      alert(`❌ Sync failed: ${result.error}`)
    }
  }}
>
  Sync Invoices
</Button>

<Button
  className="bg-blue-500 hover:bg-blue-600"
  onClick={async () => {
    const supabase = getSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user || error) {
      alert('Not logged in')
      return
    }

    // Pass the user ID explicitly via query param so /connect can build state
    const connectUrl = `/api/xero/connect?user_id=${encodeURIComponent(user.id)}`
    window.location.href = connectUrl
  }}
>
  Connect Xero
</Button>
        </div>
      </div>

    </div>
  )
}
