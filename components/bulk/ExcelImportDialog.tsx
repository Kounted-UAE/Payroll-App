// components/bulk/ExcelImportDialog.tsx

'use client'

import { useRef, useState, useEffect } from 'react'
import Papa from 'papaparse'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Upload as UploadIcon, X, Trash2, Copy, Send, Download } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { importExcelPayroll } from '@/lib/utils/importExcelPayroll'
import { excelPayrollImportSchema, EXCEL_PAYROLL_IMPORT_TEMPLATE } from '@/lib/validators/excelPayrollImportSchema'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface ExcelImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employerId: string
  onSuccess?: (batchId: string) => void
}

export function ExcelImportDialog({ open, onOpenChange, employerId, onSuccess }: ExcelImportDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [rawRows, setRawRows] = useState<any[]>([])
  const [validRows, setValidRows] = useState<any[]>([])
  const [errorLog, setErrorLog] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setFileName(file.name)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as Record<string, any>[]
        const errors: string[] = []
        const valid: any[] = []
        const previewRows: any[] = []

        const headers = results.meta.fields || []
        const missingHeaders = EXCEL_PAYROLL_IMPORT_TEMPLATE.filter((h) => !headers.includes(h))
        if (missingHeaders.length) {
          errors.push(`Missing required column headers: ${missingHeaders.join(', ')}`)
        }

        parsed.forEach((row, idx) => {
          const cleanRow: Record<string, any> = {}
          const rawPreview: Record<string, any> = { __row: idx + 1 }

          for (const key of Object.keys(row)) {
            const val = row[key]?.toString().trim() || null
            rawPreview[key] = val

            if (
              [
                'basic_salary', 'housing_allowance', 'education_allowance', 'flight_allowance',
                'general_allowance', 'gratuity_eosb', 'other_allowance', 'total_fixed_salary',
                'bonus', 'overtime', 'salary_in_arrears', 'expenses_deductions', 'other_reimbursements',
                'expense_reimbursements', 'total_variable_salary', 'total_salary',
                'wps_fees', 'total_to_transfer'
              ].includes(key)
            ) {
              const number = val?.replace(/,/g, '').trim().toLowerCase()
              const invalids = ['', 'n/a', '-', '--', 'na']
              
              cleanRow[key] =
                number && !invalids.includes(number) && !isNaN(Number(number))
                  ? parseFloat(number)
                  : null
              
            } else if (['pay_period_from', 'pay_period_to'].includes(key)) {
              const iso = val?.includes('/') ? val.split('/').reverse().join('-') : val
              const date = iso ? new Date(iso) : null
              // Convert to ISO string format that Supabase expects
              cleanRow[key] = date && !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : null
            
            } else if (key === 'currency') {
              cleanRow[key] = val || 'AED'
            } else {
              cleanRow[key] = val
            }
          }

          const result = excelPayrollImportSchema.safeParse(cleanRow)

          if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors
            Object.entries(fieldErrors).forEach(([field, messages]) => {
              errors.push(`Row ${idx + 1}: ${field} - ${messages?.join(', ')}`)
            })
          } else {
            valid.push({ ...result.data })
          }

          previewRows.push(rawPreview)
        })

        setRawRows(previewRows)
        setValidRows(valid)
        setErrorLog(errors)
        setUploading(false)
      },
      error: (err) => {
        toast({ title: 'CSV parse error', description: err.message, variant: 'destructive' })
        setUploading(false)
      },
    })
  }

  const reset = () => {
    setRawRows([])
    setValidRows([])
    setFileName(null)
    setErrorLog([])
  }

  // Reset dialog state when it is closed
useEffect(() => {
  if (!open) {
    reset()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
}, [open])

  const handleSubmit = async () => {
    try {
      const batchId = await importExcelPayroll(validRows, employerId)
      toast({ title: 'Import successful', description: `Batch ${batchId} created.` })
      onSuccess?.(batchId)
      reset()
      onOpenChange(false)
    } catch (err: any) {
      toast({ title: 'Import failed', description: err.message || 'Server error.', variant: 'destructive' })
    }
  }

  const copyErrors = () => {
    navigator.clipboard.writeText(errorLog.join('\n'))
    toast({ title: 'Error log copied to clipboard.' })
  }

  const downloadErrors = () => {
    const blob = new Blob([errorLog.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'import-errors.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Excel Payroll CSV</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          <div className="flex gap-2 items-center">
            <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <UploadIcon className="mr-2 h-4 w-4" />
              {uploading ? 'Parsing...' : 'Choose CSV'}
            </Button>
            {fileName && <Badge variant="secondary">{fileName}</Badge>}
          </div>

          {!!rawRows.length && (
            <ScrollArea className="max-h-[400px] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(rawRows[0])
                      .filter((key) => key !== '__row')
                      .map((col) => (
                        <TableHead key={col} className="text-xs whitespace-nowrap">{col}</TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawRows.map((row, i) => (
                    <TableRow key={i} className={errorLog.some(e => e.includes(`Row ${row.__row}`)) ? 'bg-red-50' : ''}>
                      {Object.entries(row)
                        .filter(([key]) => key !== '__row')
                        .map(([_, val], idx) => (
                          <TableCell key={idx} className="text-xs whitespace-nowrap">{String(val ?? '')}</TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}

          {!!rawRows.length && (
            <div className="flex items-center justify-between gap-2 border-t pt-4">
              <div className="flex gap-2">
                <Button variant="secondary" onClick={reset}>
                  <Trash2 className="mr-2 w-4 h-4" /> Reset
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  <X className="mr-2 w-4 h-4" /> Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={!validRows.length}>
                  <Send className="mr-2 w-4 h-4" /> Submit
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={copyErrors} disabled={!errorLog.length}>
                  <Copy className="w-4 h-4 mr-2" /> Copy Errors
                </Button>
                <Button variant="ghost" onClick={downloadErrors} disabled={!errorLog.length}>
                  <Download className="w-4 h-4 mr-2" /> Download Log
                </Button>
              </div>
            </div>
          )}

          {!!errorLog.length && (
            <div className="p-3 border rounded-md text-xs bg-red-50 text-red-800 max-h-[200px] overflow-auto">
              {errorLog.map((e, i) => (
                <div key={i} className="whitespace-pre-wrap">{e}</div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
