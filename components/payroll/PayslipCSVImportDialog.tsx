'use client'

import React, { useEffect, useRef, useState } from 'react'
import Papa from 'papaparse'
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

// Columns expected by public.payroll_excel_imports
const EXPECTED_COLUMNS = [
  'id',
  'employee_id',
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
  'transport_allowance',
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
  'created_at',
  'payslip_url',
  'payslip_token',
]

function toNumberOrNull(value: any): number | null {
  if (value === undefined || value === null) return null
  const trimmed = String(value).trim()
  if (trimmed === '') return null
  const n = Number(trimmed)
  return isNaN(n) ? null : n
}

/**
 * Normalizes date strings to YYYY-MM-DD format for Supabase.
 * Accepts formats: dd/mm/yyyy, d/m/yyyy, YYYY-MM-DD
 * Returns null if the date string is empty or invalid.
 */
function normalizeDateToISO(value: any): string | null {
  if (value === undefined || value === null) return null
  const trimmed = String(value).trim()
  if (trimmed === '') return null

  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }

  // Try to parse dd/mm/yyyy or d/m/yyyy format
  const ddmmyyyyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch
    // Pad day and month with leading zeros if needed
    const paddedDay = day.padStart(2, '0')
    const paddedMonth = month.padStart(2, '0')
    return `${year}-${paddedMonth}-${paddedDay}`
  }

  // If we can't parse it, return the original value and let Supabase handle it
  return trimmed
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

  // Dates - normalize to YYYY-MM-DD format for Supabase compatibility
  ;['pay_period_from','pay_period_to','created_at'].forEach(k => {
    row[k] = normalizeDateToISO(row[k])
  })

  // Numerics
  ;[
    'leave_without_pay_days','basic_salary','housing_allowance','transport_allowance','education_allowance','flight_allowance','general_allowance',
    'gratuity_eosb','other_allowance','total_gross_salary','bonus','overtime','salary_in_arrears','expenses_deductions',
    'other_reimbursements','expense_reimbursements','total_adjustments','net_salary','wps_fees','total_to_transfer'
  ].forEach(k => {
    row[k] = toNumberOrNull(row[k])
  })

  // UUIDs - keep as strings, Supabase will handle casting
  ;['id', 'employee_id', 'employer_id', 'payslip_token'].forEach(k => {
    if (row[k] != null) {
      const s = String(row[k]).trim()
      row[k] = s === '' ? null : s
    }
  })

  // Empty strings to null
  Object.keys(row).forEach(k => {
    if (row[k] === '') row[k] = null
  })

  return row
}

export default function PayslipCSVImportDialog({ open, onOpenChange, onSuccess }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<any[]>([])
  const [cleanRows, setCleanRows] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null)

  useEffect(() => {
    if (!open) {
      setFile(null)
      setParsedRows([])
      setCleanRows([])
      setErrors([])
      setImportProgress(null)
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
    setImportProgress({ current: 0, total: cleanRows.length })
    
    try {
      console.log('Starting import process...', { totalRows: cleanRows.length })
      
      // Filter out rows with missing required fields (employee_id, employer_id)
      // Note: id is optional and will be auto-generated by Supabase if not provided
      const validRows = cleanRows.filter(row => {
        const hasEmployeeId = row.employee_id && row.employee_id.trim() !== ''
        const hasEmployerId = row.employer_id && row.employer_id.trim() !== ''
        return hasEmployeeId && hasEmployerId
      })

      // Remove id field from rows where it's empty/null so Supabase can auto-generate
      const rowsToInsert = validRows.map(row => {
        const cleanRow = { ...row }
        if (!cleanRow.id || cleanRow.id.trim() === '') {
          delete cleanRow.id
        }
        return cleanRow
      })

      console.log('Validation complete:', { 
        validRows: validRows.length, 
        invalidRows: cleanRows.length - validRows.length,
        rowsWithAutoId: rowsToInsert.filter(r => !r.id).length 
      })

      if (validRows.length === 0) {
        throw new Error('No valid rows found. Make sure your CSV has employee_id and employer_id columns.')
      }

      if (validRows.length < cleanRows.length) {
        const skippedCount = cleanRows.length - validRows.length
        toast({ 
          title: 'Warning', 
          description: `Skipping ${skippedCount} row${skippedCount > 1 ? 's' : ''} with missing required fields (employee_id or employer_id)`,
          variant: 'default'
        })
      }

      // Call server-side API to import with elevated permissions
      console.log('Calling import API with', rowsToInsert.length, 'rows')
      setImportProgress({ current: 0, total: rowsToInsert.length })

      const response = await fetch('/api/admin/payslips/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: rowsToInsert })
      })

      const result = await response.json()
      console.log('Import API response:', result)

      setImportProgress({ current: rowsToInsert.length, total: rowsToInsert.length })

      if (!response.ok || !result.success) {
        const errorMessages = result.errors || [result.error || 'Unknown error']
        console.error('Import failed:', errorMessages)
        toast({ 
          title: 'Import completed with errors', 
          description: `Imported ${result.imported || 0} of ${rowsToInsert.length} rows. ${errorMessages.length} error(s) occurred.`,
          variant: 'destructive',
          duration: 10000
        })
        setErrors(errorMessages)
      } else {
        console.log('Import completed successfully:', result)
        toast({ 
          title: 'Import successful', 
          description: `Successfully imported ${result.imported} row${result.imported > 1 ? 's' : ''}`,
          duration: 5000
        })
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (e: any) {
      console.error('Import failed with exception:', e)
      toast({ 
        title: 'Import failed', 
        description: e?.message || 'Unknown error. Check console for details.', 
        variant: 'destructive',
        duration: 10000
      })
      setErrors([e?.message || 'Unknown error'])
    } finally {
      setImporting(false)
      setImportProgress(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Payslips CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative inline-block">
              <label htmlFor="csv-upload" className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white rounded-md bg-red-600 cursor-pointer hover:opacity-90">
                {file ? file.name : 'Choose CSV file'}
              </label>
              <Input id="csv-upload" type="file" accept=".csv" ref={fileRef} onChange={handleFile} className="hidden" />
            </div>
            <a 
              href="/templates/payroll_import_template.csv" 
              download="payroll_import_template.csv"
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 rounded-md border border-slate-300 hover:bg-slate-50"
            >
              Download Template
            </a>
          </div>
          
          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-md p-3">
            <p className="font-semibold mb-1">Required columns:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><code className="text-xs bg-white px-1 py-0.5 rounded">employee_id</code> - Employee UUID (required)</li>
              <li><code className="text-xs bg-white px-1 py-0.5 rounded">employer_id</code> - Employer UUID (required)</li>
            </ul>
            <p className="mt-2 text-slate-500">
              <span className="font-semibold">Optional:</span> <code className="text-xs bg-white px-1 py-0.5 rounded">id</code> - Will be auto-generated by Supabase if not provided.
            </p>
            <p className="mt-2 text-slate-500">Rows missing required fields will be skipped during import.</p>
            <p className="mt-2 text-slate-500">
              <span className="font-semibold">Date format:</span> Dates (pay_period_from, pay_period_to, created_at) can be in <code className="text-xs bg-white px-1 py-0.5 rounded">dd/mm/yyyy</code> or <code className="text-xs bg-white px-1 py-0.5 rounded">YYYY-MM-DD</code> format.
            </p>
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

              {/* Progress indicator */}
              {importProgress && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">
                      Importing... {importProgress.current} / {importProgress.total} rows
                    </span>
                    <span className="text-sm text-blue-700">
                      {Math.round((importProgress.current / importProgress.total) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error display */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm font-semibold text-red-900 mb-2">Import Errors:</p>
                  <ul className="text-xs text-red-800 space-y-1 list-disc list-inside max-h-40 overflow-y-auto">
                    {errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setFile(null); setParsedRows([]); setCleanRows([]); setErrors([]); setImportProgress(null); if (fileRef.current) fileRef.current.value = '' }} disabled={importing}>Reset</Button>
                <Button onClick={handleImport} disabled={importing || cleanRows.length === 0} className="min-w-[160px]">
                  {importing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Importing…
                    </>
                  ) : (
                    `Import ${cleanRows.length} rows`
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


