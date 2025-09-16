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
import { generatePayslipFilename } from '@/lib/utils/pdf/payslipNaming'

const SUPABASE_PUBLIC_URL = 'https://alryjvnddvrrgbuvednm.supabase.co/storage/v1/object/public/generated-pdfs/payslips'

interface PayslipEmailFlowProps {
  rows: PayslipRow[]
  selected: Set<string>
  onBack: () => void
  onRefresh?: () => void
}

export function PayslipEmailFlow({
  rows,
  selected,
  onBack,
  onRefresh,
}: PayslipEmailFlowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sendMode, setSendMode] = useState<'test' | 'reviewer' | 'live' | null>(null)
  const [isSending, setIsSending] = useState(false)

  const sendEmails = async (mode: 'test' | 'reviewer' | 'live') => {
    setIsSending(true)
    const filtered = rows.filter(r => selected.has(r.batch_id))
    const successLog: string[] = []
    const errorLog: string[] = []

    for (const row of filtered) {
      const rawTo =
        mode === 'test'
          ? 'payroll@kounted.ae'
          : mode === 'reviewer'
            ? row.reviewer_email
            : row.email_id

      const filename = generatePayslipFilename(row.employee_name || 'unknown', row.payslip_token)
      const url = `${SUPABASE_PUBLIC_URL}/${filename}`

      if (!rawTo || !row.payslip_token) {
        errorLog.push(`${row.employee_name}: Missing ${!rawTo ? 'email' : 'payslip token'}`)
        toast({
          title: `Skipping ${row.employee_name}`,
          description: !rawTo ? 'Missing email address' : 'Missing payslip token',
          variant: 'destructive',
        })
        continue
      }

      // Support multiple recipients separated by "," or ";"
      const toList = Array.isArray(rawTo)
        ? rawTo
        : String(rawTo)
            .split(/[;,]/)
            .map(e => e.trim())
            .filter(Boolean)

      try {
        const res = await fetch('/api/send-payslip-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: toList.length === 1 ? toList[0] : toList,
            name: row.employee_name,
            url,
            batch_id: row.batch_id,
          }),
        })

        if (res.ok) {
          successLog.push(`${row.employee_name} → ${toList.join(', ')}`)
        } else {
          const msg = await res.text()
          errorLog.push(`${row.employee_name} → ${toList.join(', ')}: ${msg}`)
          toast({
            title: `Failed to send: ${row.employee_name}`,
            description: msg,
            variant: 'destructive',
          })
        }
      } catch (e: any) {
        const msg = e?.message || 'Network error'
        errorLog.push(`${row.employee_name} → ${toList.join(', ')}: ${msg}`)
        toast({ title: `Failed to send: ${row.employee_name}`, description: msg, variant: 'destructive' })
      }
    }

    setIsSending(false)

    if (successLog.length) {
      toast({
        title: 'Emails sent',
        description: `${successLog.length} of ${filtered.length} emails delivered successfully.`,
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
      // Refresh data to show updated "Last Sent" times
      onRefresh?.()
    }

    if (errorLog.length) {
      toast({
        title: 'Some emails failed',
        description: `${errorLog.length} failed. Click to copy error log.`,
        variant: 'destructive',
        action: (
          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              navigator.clipboard.writeText(errorLog.join('\n')).then(() =>
                toast({ title: 'Error log copied' })
              )
            }
          >
            Copy Errors
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
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!sendMode) return
                await sendEmails(sendMode)
                setConfirmOpen(false)
                onBack()
              }}
              disabled={isSending}
            >
              {isSending ? 'Sending…' : 'Confirm Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="text-cyan-600 text-sm">
        Send payslips for <strong>{selectedRows.length}</strong> selected employees.
      </p>
      
      <div className="flex gap-4 mt-4">
        <Button variant="outline" onClick={() => { setSendMode('test'); setConfirmOpen(true) }} disabled={isSending}>
          Send to Test Email
        </Button>
        <Button variant="outline" onClick={() => { setSendMode('reviewer'); setConfirmOpen(true) }} disabled={isSending}>
          Send to Reviewer Email
        </Button>
        <Button variant="default" onClick={() => { setSendMode('live'); setConfirmOpen(true) }} disabled={isSending}>
          Send to Live Email
        </Button>
        <Button variant="ghost" onClick={onBack} disabled={isSending}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
