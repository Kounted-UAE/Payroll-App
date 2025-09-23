'use client'

import React, { useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
import { createClient } from '@supabase/supabase-js'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/react-ui/dialog'
import { Button } from '@/components/react-ui/button'
import { Badge } from '@/components/react-ui/badge'
import { Input } from '@/components/react-ui/input'
import { toast } from '@/hooks/use-toast'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase env vars')
  }
  return createClient(supabaseUrl, supabaseKey)
}

// Columns expected by public.payroll_ingest_excelpayrollimport
const EXPECTED_COLUMNS = [
  'employer_id',
  'employer_name',
  'reviewer_email',
  'employee_name',
  'email_id',
  'employee_mol',
  'bank_name',
  'iban',
  'pay_period_from',
  'pay_period_to',
  'leave_without_pay_days',
  'currency',
  'basic_salary',
  'housing_allowance',
  'education_allowance',
  'flight_allowance',
  'general_allowance',
  'gratuity_eosb',
  'other_allowance',
  'total_gross_salary',
  'bonus',
  'overtime',
  'salary_in_arrears',
  'expenses_deductions',
  'other_reimbursements',
  'expense_reimbursements',
  'total_adjustments',
  'net_salary',
  'wps_fees',
  'total_to_transfer',
  'transport_allowance',
]

function toNumberOrNull(value: any): number | null {
  if (value === undefined || value === null) return null
  const trimmed = String(value).trim()
  if (trimmed === '') return null
  const n = Number(trimmed)
  return isNaN(n) ? null : n
}

function normalizeRow(input: Record<string, any>) {
  const row: Record<string, any> = {}

  EXPECTED_COLUMNS.forEach((key) => {
    row[key] = input[key]
  })

  // Trim strings
  ;['employer_name','reviewer_email','employee_name','email_id','employee_mol','bank_name','iban','currency'].forEach(k => {
    if (row[k] != null) row[k] = String(row[k]).trim()
  })

  // Dates (let Supabase cast from string 'YYYY-MM-DD'), keep empty as null
  ;['pay_period_from','pay_period_to'].forEach(k => {
    if (row[k] != null) {
      const s = String(row[k]).trim()
      row[k] = s === '' ? null : s
    }
  })

  // Numerics
  ;[
    'leave_without_pay_days','basic_salary','housing_allowance','education_allowance','flight_allowance','general_allowance',
    'gratuity_eosb','other_allowance','total_gross_salary','bonus','overtime','salary_in_arrears','expenses_deductions',
    'other_reimbursements','expense_reimbursements','total_adjustments','net_salary','wps_fees','total_to_transfer','transport_allowance'
  ].forEach(k => {
    row[k] = toNumberOrNull(row[k])
  })

  // Empty strings to null
  Object.keys(row).forEach(k => {
    if (row[k] === '') row[k] = null
  })

  // Do NOT set batch_id; let DB default generate per row
  // Do NOT set employee_id; let DB default generate

  return row
}

export default function PayslipCSVImportDialog({ open, onOpenChange, onSuccess }: Props) {
  const supabase = React.useMemo(createSupabaseClient, [])
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<any[]>([])
  const [cleanRows, setCleanRows] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    if (!open) {
      setFile(null)
      setParsedRows([])
      setCleanRows([])
      setErrors([])
      if (fileRef.current) fileRef.current.value = ''
    }
  }, [open])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = (result.data as any[]).filter(r => Object.values(r).some(v => String(v).trim() !== ''))
        const provided = (result.meta.fields || []).filter(Boolean) as string[]
        const normalized = rows.map(normalizeRow)
        setParsedRows(rows)
        setCleanRows(normalized)
        setColumns(provided)
        setErrors([])
      },
      error: (err) => {
        toast({ title: 'CSV parse error', description: err.message, variant: 'destructive' })
      }
    })
  }

  const handleImport = async () => {
    if (cleanRows.length === 0) return
    setImporting(true)
    try {
      const { error } = await supabase
        .from('payroll_ingest_excelpayrollimport')
        .insert(cleanRows)

      if (error) throw error

      toast({ title: 'Import successful', description: `Imported ${cleanRows.length} rows` })
      onOpenChange(false)
      onSuccess?.()
    } catch (e: any) {
      toast({ title: 'Import failed', description: e?.message || 'Unknown error', variant: 'destructive' })
    } finally {
      setImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Payslips CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative inline-block">
            <label htmlFor="csv-upload" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white rounded-md bg-red-600 cursor-pointer hover:opacity-90">
              {file ? file.name : 'Choose CSV file'}
            </label>
            <Input id="csv-upload" type="file" accept=".csv" ref={fileRef} onChange={handleFile} className="hidden" />
          </div>

          {parsedRows.length > 0 && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">Previewing {parsedRows.length} rows</div>

              <Badge variant="secondary">Detected {columns.length} column(s). All columns are optional.</Badge>

              <div className="overflow-x-auto border rounded">
                <table className="text-xs w-full">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      {(columns.length ? columns : EXPECTED_COLUMNS).map(c => (
                        <th key={c} className="px-3 py-2 text-left font-medium">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cleanRows.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-t">
                        {(columns.length ? columns : EXPECTED_COLUMNS).map(c => (
                          <td key={c} className="px-3 py-2">{(row as any)[c]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setFile(null); setParsedRows([]); setCleanRows([]); setErrors([]); if (fileRef.current) fileRef.current.value = '' }} disabled={importing}>Reset</Button>
                <Button onClick={handleImport} disabled={importing || cleanRows.length === 0} className="min-w-[160px]">
                  {importing ? 'Importing…' : `Import ${cleanRows.length} rows`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


