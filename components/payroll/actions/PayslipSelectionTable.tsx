// components/advontier-payroll/actions/PayslipSelectionTable.tsx

'use client'

import { Checkbox } from '@/components/react-ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/react-ui/table'
import { generatePayslipFilename } from '@/lib/utils/pdf/payslipNaming'

const SUPABASE_PUBLIC_URL = 'https://alryjvnddvrrgbuvednm.supabase.co/storage/v1/object/public/generated-pdfs/payslips'

export type PayslipRow = {
  id: string
  employee_name: string
  employer_name: string
  reviewer_email: string
  email_id: string
  payslip_url: string
  payslip_token: string
  created_at: string
}

interface PayslipSelectionTableProps {
  rows: PayslipRow[]
  filteredRows: PayslipRow[]
  selectedIds: Set<string>
  onToggleSelection: (id: string) => void
  onToggleAll: (checked: boolean) => void
  className?: string
}

export default function PayslipSelectionTable({
  rows,
  filteredRows,
  selectedIds,
  onToggleSelection,
  onToggleAll,
  className = "mt-4"
}: PayslipSelectionTableProps) {
  const allSelected = filteredRows.length > 0 && filteredRows.every(r => selectedIds.has(r.id))
  const someSelected = filteredRows.some(r => selectedIds.has(r.id)) && !allSelected

  const handleSelectAllChange = (checked: boolean | 'indeterminate') => {
    if (checked === 'indeterminate') return
    onToggleAll(checked)
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={handleSelectAllChange}
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
        {filteredRows.map(row => (
          <TableRow key={row.id}>
            <TableCell>
              <Checkbox
                checked={selectedIds.has(row.id)}
                onCheckedChange={() => onToggleSelection(row.id)}
              />
            </TableCell>
            <TableCell>{row.employee_name}</TableCell>
            <TableCell>{row.employer_name}</TableCell>
            <TableCell>{row.reviewer_email}</TableCell>
            <TableCell>{row.email_id}</TableCell>
            <TableCell>
              {row.payslip_token ? (
                <a
                  href={row.payslip_url && row.payslip_url.startsWith('http')
                    ? row.payslip_url
                    : `${SUPABASE_PUBLIC_URL}/${generatePayslipFilename(row.employee_name || 'unknown', row.payslip_token)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-xs"
                >
                  View PDF
                </a>
              ) : (
                <span className="text-blue-200 text-xs">Not available</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}