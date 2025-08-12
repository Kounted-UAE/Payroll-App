// app/advontier/admin/xero-config/page.tsx

'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import XeroStatCards from '@/components/admin/xero-config/XeroStatCards'
import XeroSectionHeader from '@/components/admin/xero-config/XeroTabSectionHeader'
import XeroTabTableInvoices from '@/components/admin/xero-config/XeroTabTableInvoices'
import XeroSearchBar from '@/components/admin/xero-config/XeroSearchBar'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function XeroConfigPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-lg text-zinc-600 font-bold">Xero Config</h1>

        <div className="flex gap-2">
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={async () => {
              const res = await fetch('/api/xero/sync/invoices', {
                method: 'GET'
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

      {/* Add your Xero configuration content here */}
      <div className="mt-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <XeroStatCards />
          </TabsContent>
          
          <TabsContent value="invoices">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Invoice Management</h3>
            </div>
            <XeroSearchBar value={searchValue} onChange={setSearchValue} />
            <XeroTabTableInvoices search={searchValue} />
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Xero Settings</h3>
              <p>Configure your Xero integration settings here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
