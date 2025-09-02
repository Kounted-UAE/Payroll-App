'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import type { PayslipRow } from './PayslipFiltersAndTable'

const SUPABASE_PUBLIC_URL = 'https://alryjvnddvrrgbuvednm.supabase.co/storage/v1/object/public/generated-pdfs/payslips'

interface PayslipEmailFlowProps {
  rows: PayslipRow[]
  selected: Set<string>
  onBack: () => void
}

export function PayslipEmailFlow({
  rows,
  selected,
  onBack,
}: PayslipEmailFlowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sendMode, setSendMode] = useState<'test' | 'reviewer' | 'live' | null>(null)

  const sendEmails = async (mode: 'test' | 'reviewer' | 'live') => {
    const filtered = rows.filter(r => selected.has(r.batch_id))
    const successLog: string[] = []

    for (const row of filtered) {
      const to =
        mode === 'test'
          ? 'payroll@kounted.ae'
          : mode === 'reviewer'
            ? row.reviewer_email
            : row.email_id

      const url = `${SUPABASE_PUBLIC_URL}/${row.payslip_token}.pdf`

      if (!to || !row.payslip_token) {
        toast({
          title: `Skipping ${row.employee_name}`,
          description: 'Missing email or payslip token',
          variant: 'destructive',
        })
        continue
      }

      const res = await fetch('/api/send-payslip-email', {
        method: 'POST',
        body: JSON.stringify({
          to,
          name: row.employee_name,
          url,
        }),
      })

      if (res.ok) {
        successLog.push(`${row.employee_name} → ${to}`)
      } else {
        toast({
          title: `Failed to send to ${to}`,
          description: await res.text(),
          variant: 'destructive',
        })
      }
    }

    if (successLog.length) {
      toast({
        title: 'Emails sent',
        description: `${successLog.length} emails delivered successfully.`,
        action: (
          <Button
            variant="default"
            size="sm"
            onClick={() =>
              navigator.clipboard.writeText(successLog.join('\n')).then(() =>
                toast({ title: 'Copied to clipboard' })
              )
            }
          >
            Copy Log
          </Button>
        ),
      })
    }
  }

  const selectedRows = rows.filter(r => selected.has(r.batch_id))

  return (
    <div className="space-y-4">
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payslip Emails</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-cyan-600 space-y-2 max-h-[300px] overflow-auto">
            {selectedRows.map(r => {
              const to =
                sendMode === 'test' ? 'payroll@kounted.ae' :
                  sendMode === 'reviewer' ? r.reviewer_email :
                    r.email_id

              return (
                <div key={r.batch_id}>
                  <strong>{r.employee_name}</strong> → {to || <em>Missing Email</em>}
                </div>
              )
            })}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!sendMode) return
                await sendEmails(sendMode)
                setConfirmOpen(false)
                onBack()
              }}
            >
              Confirm Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-cyan-600 text-sm">
        Send payslips for <strong>{selected.size}</strong> selected employees.
      </p>
      
      <div className="flex gap-4 mt-4">
        <Button variant="outline" onClick={() => { setSendMode('test'); setConfirmOpen(true) }}>
          Send to Test Email
        </Button>
        <Button variant="outline" onClick={() => { setSendMode('reviewer'); setConfirmOpen(true) }}>
          Send to Reviewer Email
        </Button>
        <Button variant="default" onClick={() => { setSendMode('live'); setConfirmOpen(true) }}>
          Send to Live Email
        </Button>
        <Button variant="ghost" onClick={onBack}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
