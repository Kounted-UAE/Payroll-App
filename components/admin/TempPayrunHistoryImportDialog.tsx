// components/bulk/TempPayrunHistoryImportDialog.tsx

'use client'

import React, { useRef, useState, useEffect } from 'react'
import Papa from 'papaparse'
import { toast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/react-ui/dialog'
import { Button } from '@/components/react-ui/button'
import { Input } from '@/components/react-ui/input'
import { Badge } from '@/components/react-ui/badge'
import { Upload as UploadIcon } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { tempPayrunSchema } from '@/lib/validators/tempPayrunSchema'
import { checkForTempPayrunDuplicates } from '@/lib/utils/tempPayrunCheckForDuplicates'
import { flattenPayrunMatrix } from '@/lib/utils/flattenPayrunMatrix'


// Function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  return createClient(supabaseUrl, supabaseKey)
}


type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TempPayrunHistoryImportDialog({ open, onOpenChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [parsedRows, setParsedRows] = useState<any[]>([])
  const [validRows, setValidRows] = useState<any[]>([])
  const [errorRows, setErrorRows] = useState<{ row: number; error: string }[]>([])
  const [importing, setImporting] = useState(false)

  const resetState = () => {
    setCsvFile(null)
    setParsedRows([])
    setValidRows([])
    setErrorRows([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => {
    if (open) resetState()
  }, [open])

  


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const raw = results.data as any[]
        const flattened = flattenPayrunMatrix(raw, file.name)
        setParsedRows(flattened)

        const validated: any[] = []
        const errors: { row: number; error: string }[] = []

        flattened.forEach((row, idx) => {
          const parsed = tempPayrunSchema.safeParse(row)
          if (parsed.success) {
            validated.push({ ...parsed.data, __index: row.row_number || idx + 2 })
          } else {
            errors.push({
              row: row.row_number || idx + 2,
              error: parsed.error.errors.map(e => e.message).join('; ')
            })
          }
        })

        try {
          const supabase = createSupabaseClient()
          const { data: existingRows, error } = await supabase
            .from('payroll_ingest_payrun_matrix')
            .select('employee_id, payrun_code, temp_paytype_name')

          if (error) throw error

          const { unique, duplicates } = checkForTempPayrunDuplicates(
            validated,
            existingRows || [],
            ['employee_id', 'payrun_code', 'temp_paytype_name']
          )

          setValidRows(unique)
          setErrorRows([
            ...errors,
            ...duplicates.map(d => ({
              row: d.__index,
              error: 'Duplicate entry'
            }))
          ])
        } catch (err) {
          toast({
            title: 'Error checking duplicates',
            description: err instanceof Error ? err.message : 'Unknown error',
            variant: 'destructive'
          })
        }
      },
      error: (err) => {
        toast({ title: 'Parse error', description: err.message, variant: 'destructive' })
      }
    })
  }

  const handleImport = async () => {
    setImporting(true)
    try {
      const supabase = createSupabaseClient()
      const cleanRows = validRows.map(({ __index, ...rest }) => rest)
      const { error } = await supabase
        .from('payroll_ingest_payrun_matrix')
        .insert(cleanRows)

      if (error) throw error

      toast({
        title: 'Import successful',
        description: `Imported ${cleanRows.length} rows`
      })
      onOpenChange(false)
    } catch (err) {
      toast({
        title: 'Import error',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'destructive'
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Historical Payrun Records</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative inline-block">
            <label
              htmlFor="csv-upload"
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-blue-700  rounded-md bg-white cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <UploadIcon className="w-4 h-4" />
              {csvFile ? csvFile.name : 'Upload CSV File'}
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {parsedRows.length > 0 && (
            <div className="space-y-4">
              <div className="text-sm text-blue-200">
                Previewing {parsedRows.length} rows.
              </div>

              <div className="overflow-x-auto border rounded">
                <table className="text-xs w-full">
                  <thead>
                    <tr className="bg-blue-100">
                      {Object.keys(parsedRows[0]).map((col) => (
                        <th key={col} className="px-3 py-2 text-left font-medium">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="border-t">
                        {Object.keys(parsedRows[0]).map(col => (
                          <td key={col} className="px-3 py-2">{row[col]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errorRows.length > 0 ? (
                <div className="flex items-center justify-between p-3 bg-blue-100/50 rounded-lg">
                  <Badge variant="destructive">{errorRows.length} row(s) with errors</Badge>
                </div>
              ) : (
                <Badge variant="default">All rows valid</Badge>
              )}

              {errorRows.length > 0 && (
                <div className="border rounded-lg p-3">
                  <div className="text-sm font-medium mb-2 text-destructive">Validation Errors:</div>
                  <div className="max-h-32 overflow-y-auto text-xs text-destructive">
                    <ul className="space-y-1">
                      {errorRows.map((err, i) => (
                        <li key={i} className="flex">
                          <span className="font-mono mr-2">Row {err.row}:</span>
                          <span>{err.error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const text = errorRows.map(e => `Row ${e.row}: ${e.error}`).join('\n')
                        navigator.clipboard.writeText(text)
                        toast({ title: 'Copied', description: 'Error messages copied to clipboard.' })
                      }}
                    >
                      Copy Errors
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={resetState} disabled={importing}>
                  Reset
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={importing || validRows.length === 0}
                  className="min-w-[140px]"
                >
                  {importing ? 'Importing...' : `Import ${validRows.length} records`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
