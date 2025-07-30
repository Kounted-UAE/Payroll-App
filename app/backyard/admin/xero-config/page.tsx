// app/backyard/admin/temp-payrun-history/page.tsx

'use client'

import { useState } from 'react'
import TempPayrunHistoryImportDialog from '@/components/bulk/TempPayrunHistoryImportDialog'

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
       
      </div>

    </div>
  )
}
