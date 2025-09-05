//app/advontier/admin/temp-excelpayrun-import/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { PayslipFiltersAndTable, type PayslipRow } from '@/components/admin/PayslipFiltersAndTable'
import { PayslipEmailFlow } from '@/components/admin/PayslipEmailFlow'
import PayslipGenerateFlow from '@/components/admin/PayslipGenerateFlow'

export default function SendPayslipsPage() {
  const [rows, setRows] = useState<PayslipRow[]>([])
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [step, setStep] = useState<'select' | 'generate' | 'review'>('select')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(200)
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const fetchServer = async (pg: number, size: number, sort: string, dir: 'asc' | 'desc') => {
      const offset = (pg - 1) * size
      const params = new URLSearchParams({ limit: String(size), offset: String(offset), sortBy: sort, sortDir: dir })
      const res = await fetch(`/api/admin/payslips/list?${params.toString()}`)
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      const rows: PayslipRow[] = (json.rows as any[])?.map((r: any) => ({
        batch_id: r.batch_id,
        employer_name: r.employer_name,
        employee_name: r.employee_name,
        reviewer_email: r.reviewer_email,
        email_id: r.email_id,
        payslip_url: r.payslip_url,
        payslip_token: r.payslip_token,
        created_at: r.created_at,
        pay_period_to: r.pay_period_to,
        last_sent_at: r.last_sent_at || null,
      })) ?? []
      setRows(rows)
      setTotal(Number(json.total || 0))
    }

    const load = async () => {
      try {
        await fetchServer(page, pageSize, sortBy, sortDir)
      } catch (e: any) {
        toast({ title: 'Error loading rows', description: e.message, variant: 'destructive' })
      }
    }

    load()
  }, [page, pageSize, sortBy, sortDir])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg text-zinc-600 font-bold">Send Payslips</h1>
        <p className="text-white text-sm bg-red-600 px-2 py-1 rounded-md shadow-xs">-temp payroll tool-</p>
      </div>
      {step === 'select' ? (
        <PayslipFiltersAndTable
          rows={rows}
          selected={selected}
          onSelectionChange={setSelected}
          onProceedToEmail={() => setStep('review')}
          onProceedToGenerate={() => setStep('generate')}
          journalWizardOpen={false}
          setJournalWizardOpen={() => {}}
          detailedWizardOpen={false}
          setDetailedWizardOpen={() => {}}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(n) => { setPageSize(n); setPage(1) }}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={(field) => {
            if (sortBy === field) {
              setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
            } else {
              setSortBy(field)
              setSortDir('asc')
            }
            setPage(1)
          }}
          onClearSort={() => { setSortBy('created_at'); setSortDir('desc'); setPage(1) }}
        />
      ) : step === 'generate' ? (
        <PayslipGenerateFlow
          rows={rows}
          selected={selected}
          onBack={() => setStep('select')}
          onDone={async () => {
            setStep('select')
            // refresh data
            try {
              const offset = (page - 1) * pageSize
              const params = new URLSearchParams({ limit: String(pageSize), offset: String(offset), sortBy, sortDir })
              const res = await fetch(`/api/admin/payslips/list?${params.toString()}`)
              const json = await res.json()
              const rows: PayslipRow[] = (json.rows as any[])?.map((r: any) => ({
                batch_id: r.batch_id,
                employer_name: r.employer_name,
                employee_name: r.employee_name,
                reviewer_email: r.reviewer_email,
                email_id: r.email_id,
                payslip_url: r.payslip_url,
                payslip_token: r.payslip_token,
                created_at: r.created_at,
                pay_period_to: r.pay_period_to,
                last_sent_at: r.last_sent_at || null,
              })) ?? []
              setRows(rows)
              setTotal(Number(json.total || 0))
            } catch {}
          }}
        />
      ) : (
        <PayslipEmailFlow
          rows={rows}
          selected={selected}
          onBack={() => setStep('select')}
        />
      )}
    </div>
  )
}
