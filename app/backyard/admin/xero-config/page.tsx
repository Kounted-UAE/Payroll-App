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

export default function XeroSyncPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="p-6 space-y-6">
      {/* Heading */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Xero Sync</h1>
          <p className="text-muted-foreground text-sm">
            Sync and manage invoices and quotes from connected Xero clients
          </p>
        </div>
        <div className="flex gap-2">
        <Button
  className="bg-blue-500 hover:bg-blue-600"
  onClick={async () => {
    const res = await fetch('/api/xero/sync/invoices', {
      method: 'GET',
      credentials: 'include', // 🧠 ensures cookies (auth) are sent
    })

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
            onClick={() => {
              window.location.href = '/api/xero/connect'
            }}
          >
            Connect Xero
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <XeroStatCards />

      {/* Search Bar */}
      <XeroSearchBar value={searchQuery} onChange={setSearchQuery} />

      {/* Tabs + Tables */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices">
          <XeroTabTableInvoices search={searchQuery} />
        </TabsContent>
        <TabsContent value="quotes">
          
        </TabsContent>
      </Tabs>
    </div>
  )
}
