// app/backyard/admin/temp-excelpayrun-import/page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Download, FileUp, Search, Eye, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExcelImportDialog } from '@/components/bulk/ExcelImportDialog'
import { toast } from '@/hooks/use-toast'

const PayrollImportBatches = () => {
  const router = useRouter()
  const [batches, setBatches] = useState<any[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [search, setSearch] = useState('')
  const [employerMap, setEmployerMap] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabaseClient()

      // Step 1: Get unique batch_ids
      const { data: distinct, error: errorDistinct } = await supabase
        .from('payroll_ingest_excelpayrollimport')
        .select('batch_id') // No filter for nulls
        .order('created_at', { ascending: false })
        .limit(100)

      if (errorDistinct || !distinct) return

      const batchIds = [
        ...new Set(distinct.map((b) => b.batch_id).filter((id): id is string => !!id))
      ]
      console.log('Distinct batch_ids:', distinct)


      // Step 2: For each batch_id, fetch group meta
      const { data: allRows, error: fetchError } = await supabase
        .from('payroll_ingest_excelpayrollimport')
        .select('batch_id, employer_name, employer_id, pay_period_from, pay_period_to, total_salary, created_at')

      if (fetchError) {
        console.error(fetchError)
        toast({
          title: 'Error loading batches',
          description: fetchError.message,
          variant: 'destructive',
        })
        return
      }

      const grouped = batchIds.map((batchId) => {
        const rows = allRows.filter((r) => r.batch_id === batchId)
        const totalEmployees = rows.length
        const totalPay = rows.reduce((sum, r) => sum + (r.total_salary || 0), 0)
        const payPeriodFrom = rows[0]?.pay_period_from
        const payPeriodTo = rows[0]?.pay_period_to
        const employerName = rows[0]?.employer_name || 'Unknown'
        const createdAt = rows[0]?.created_at

        return {
          batch_id: batchId,
          totalEmployees,
          totalPay,
          payPeriodFrom,
          payPeriodTo,
          employerName,
          createdAt,
        }
      })

      setBatches(grouped)
    }

    fetchData()
  }, [])

  const filtered = batches.filter((b) =>
    b.employerName.toLowerCase().includes(search.toLowerCase()) ||
    b.batch_id.toLowerCase().includes(search.toLowerCase())
  )

  const downloadTemplate = () => {
    const headers = [
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
      'total_fixed_salary',
      'bonus',
      'overtime',
      'salary_in_arrears',
      'adhoc_expenses',
      'school_reimbursements',
      'internet_reimbursements',
      'total_variable_salary',
      'total_salary',
      'wps_fees',
      'total_to_transfer',
    ]

    const csv = [headers.join(',')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'payroll-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Payroll Import Batches</h1>
          <p className="text-muted-foreground">
            View and manage imported Excel payroll batch uploads.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadTemplate} className='bg-white text-primary hover:bg-blue-100 hover:text-blue-500'>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Button variant="outline" onClick={() => setOpenDialog(true)} className='bg-primary text-white hover:bg-primary/70'>
            <FileUp className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employer or batch ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Batches</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
          <TableHeader>
  <TableRow>
    <TableHead>Batch ID</TableHead>
    <TableHead>Employer</TableHead>
    <TableHead>Employees</TableHead>
    <TableHead>Pay Period</TableHead>
    <TableHead>Total Salary</TableHead>
    <TableHead>Created</TableHead>
    <TableHead>Actions</TableHead>
  </TableRow>
</TableHeader>

<TableBody>
  {filtered.map((b) => (
    <TableRow
      key={b.batch_id}
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => router.push(`/backyard/admin/payroll-preview/${b.batch_id}`)}
    >
      <TableCell className="font-mono text-xs">{b.batch_id}</TableCell>
      <TableCell>{b.employerName}</TableCell>
      <TableCell>{b.totalEmployees}</TableCell>
      <TableCell>{b.payPeriodFrom} → {b.payPeriodTo}</TableCell>
      <TableCell>AED {b.totalPay.toLocaleString()}</TableCell>
      <TableCell>{new Date(b.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => router.push(`/backyard/admin/payroll-preview/${b.batch_id}`)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => console.log('TODO: Implement delete')}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </CardContent>
      </Card>

      <ExcelImportDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        employerId="REPLACE_ME"
        onSuccess={(batchId) => router.push(`/backyard/admin/payroll-preview/${batchId}`)}
      />
    </div>
  )
}

export default PayrollImportBatches
