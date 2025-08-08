// app/backyard/admin/temp-payrun-history/page.tsx

'use client'

import { useState } from 'react'
import TempPayrunHistoryImportDialog from '@/components/advontier-dialogs/TempPayrunHistoryImportDialog'

export default function TempPayrunHistoryPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Import Historical Payruns</h1>

        <button
          className="border rounded bg-red-400 text-white px-4 py-2 text-sm hover:bg-muted"
          onClick={() => setDialogOpen(true)}
        >
          Import Payrun CSV
        </button>
      
      </div>

      <TempPayrunHistoryImportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
