'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'


type PayslipRow = {
  id: string
  employee_name: string
  employer_name: string
  reviewer_email: string
  email_id: string
  payslip_url: string
  created_at: string
}

export default function SendPayslipsPage() {
  const [rows, setRows] = useState<PayslipRow[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [step, setStep] = useState<'select' | 'review'>('select')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sendMode, setSendMode] = useState<'test' | 'reviewer' | 'live' | null>(null)
  const [search, setSearch] = useState('')

  const downloadZip = async () => {
    const zip = new JSZip()
    const selectedRows = rows.filter(r => selected.has(r.id))

    for (const row of selectedRows) {
      if (!row.payslip_url) continue
      const res = await fetch(row.payslip_url)
      const blob = await res.blob()
      const rawFilename = row.payslip_url?.split('/').pop()?.split('?')[0]
      const filename = rawFilename?.endsWith('.pdf') ? rawFilename : `${rawFilename}.pdf`
      zip.file(filename, blob)
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, 'selected-payslips.zip')
  }

  useEffect(() => {
    const fetch = async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('payroll_ingest_excelpayrollimport')
        .select('id, employer_name, employee_name, reviewer_email, email_id, payslip_url, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        toast({ title: 'Error loading rows', description: error.message, variant: 'destructive' })
      } else {
        setRows(data)
      }
    }

    fetch()
  }, [])

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const sendEmails = async (mode: 'test' | 'reviewer' | 'live') => {
    const filtered = rows.filter(r => selected.has(r.id))
    const successLog: string[] = []

    for (const row of filtered) {
      const to =
        mode === 'test'
          ? 'payroll@kounted.ae'
          : mode === 'reviewer'
            ? row.reviewer_email
            : row.email_id

      if (!to || !row.payslip_url) {
        toast({
          title: `Skipping ${row.employee_name}`,
          description: 'Missing email or payslip link',
          variant: 'destructive',
        })
        continue
      }

      const res = await fetch('/api/send-payslip-email', {
        method: 'POST',
        body: JSON.stringify({
          to,
          name: row.employee_name,
          url: row.payslip_url,
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
            variant="ghost"
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

  const filtered = rows.filter(row =>
    row.employee_name.toLowerCase().includes(search.toLowerCase()) ||
    row.employer_name.toLowerCase().includes(search.toLowerCase()) ||
    row.reviewer_email.toLowerCase().includes(search.toLowerCase()) ||
    row.email_id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Send Payslips</h1>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search employee, employer, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm"
          />
          {search && (
            <Button variant="ghost" size="sm" onClick={() => setSearch('')}>
              Clear
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filtered.length} result{filtered.length !== 1 && 's'}
        </div>
      </div>

      {/* Dialog for email preview */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payslip Emails</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-2 max-h-[300px] overflow-auto">
            {rows.filter(r => selected.has(r.id)).map(r => {
              const to =
                sendMode === 'test' ? 'payroll@kounted.ae' :
                  sendMode === 'reviewer' ? r.reviewer_email :
                    r.email_id

              return (
                <div key={r.id}>
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
                setStep('select')
              }}
            >
              Confirm Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Selection table */}
      {step === 'select' && (
        <>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={filtered.every(r => selected.has(r.id))}
                    indeterminate={
                      filtered.some(r => selected.has(r.id)) &&
                      !filtered.every(r => selected.has(r.id))
                    }
                    onCheckedChange={(checked) => {
                      const next = new Set(selected)
                      filtered.forEach(row => {
                        if (checked) {
                          next.add(row.id)
                        } else {
                          next.delete(row.id)
                        }
                      })
                      setSelected(next)
                    }}
                  />
                </TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Employer</TableHead>
                <TableHead>Reviewer Email</TableHead>
                <TableHead>Live Email</TableHead>
                <TableHead>Payslip</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(row => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.has(row.id)}
                      onCheckedChange={() => toggle(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.employee_name}</TableCell>
                  <TableCell>{row.employer_name}</TableCell>
                  <TableCell>{row.reviewer_email}</TableCell>
                  <TableCell>{row.email_id}</TableCell>
                  <TableCell>
                    {row.payslip_url ? (
                      <a href={row.payslip_url} target="_blank" className="text-blue-600 underline text-xs">
                        View PDF
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">Not available</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button className="mt-4" onClick={() => setStep('review')} disabled={!selected.size}>
            Continue
          </Button>
          <Button
            variant="outline"
            onClick={downloadZip}
            disabled={!rows.some(r => selected.has(r.id) && r.payslip_url)}
          >
            Download Selected (ZIP)
          </Button>
        </>
      )}

      {/* Review and send step */}
      {step === 'review' && (
        <>
          <p className="text-muted-foreground text-sm">
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
            <Button variant="ghost" onClick={() => setStep('select')}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
