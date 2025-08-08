//components/wizards/payroll-wizards/PayrunDetailedJournalExport.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

type ExportDetailedXeroJournalsWizardProps = {
  payrollRows: any[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDetailedXeroJournalsWizard({ payrollRows, open, onOpenChange }: ExportDetailedXeroJournalsWizardProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const employers = Array.from(new Set(payrollRows.map(r => String(r.employer_name))))
  const toggle = (employer: string) => {
    const next = new Set(selected)
    next.has(employer) ? next.delete(employer) : next.add(employer)
    setSelected(next)
  }

  const handleExport = () => {
    employers.forEach(employer => {
      if (!selected.has(employer)) return
      const rows = payrollRows.filter(r => String(r.employer_name) === employer)
      const csv = generateDetailedJournalCSV(employer, rows)
      const filename = String(employer).replace(/[^a-z0-9]/gi, '_') + '_detailed_payrun_journal.csv'
      downloadCSV(csv, filename)
    })
    if (onOpenChange) onOpenChange(false)
  }


  const handleSendTest = async (testEmail: string) => {
    for (const employer of Array.from(selected)) {
      const rows = payrollRows.filter(r => String(r.employer_name) === employer)
      const csv = generateDetailedJournalCSV(employer, rows)  // <-- use detailed
      const filename = String(employer).replace(/[^a-z0-9]/gi, '_') + '_detailed_payrun_journal.csv'
  
      await fetch('/api/send-journal-to-reviewer', {
        method: 'POST',
        body: JSON.stringify({
          to: testEmail,
          employer,
          csv,
          filename,
          subject: `[TEST] Payroll Journal for ${employer}`,
        }),
        headers: { 'Content-Type': 'application/json' }
      })
    }
    alert('Test emails sent!')
    if (onOpenChange) onOpenChange(false)
  }
  
  const handleSendReview = async () => {
    for (const employer of Array.from(selected)) {
      const rows = payrollRows.filter(r => String(r.employer_name) === employer)
      const reviewerEmail = rows[0]?.reviewer_email
      if (!reviewerEmail) {
        alert(`Reviewer email not found for ${employer}`)
        continue
      }
      const csv = generateDetailedJournalCSV(employer, rows) // <-- use detailed
      const filename = String(employer).replace(/[^a-z0-9]/gi, '_') + '_detailed_payrun_journal.csv'
      await fetch('/api/send-journal-to-reviewer', {
        method: 'POST',
        body: JSON.stringify({
          to: reviewerEmail,
          employer,
          csv,
          filename,
          subject: `Payroll Journal for ${employer}`,
        }),
        headers: { 'Content-Type': 'application/json' }
      })
    }
    alert('Review emails sent!')
    if (onOpenChange) onOpenChange(false)
  }
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Employers for Export</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Employer Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employers.map(emp => (
                <TableRow key={String(emp)}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selected.has(String(emp))}
                      onChange={() => toggle(String(emp))}
                    />
                  </TableCell>
                  <TableCell>{String(emp)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button disabled={selected.size === 0} onClick={handleExport}>
            Generate Export
          </Button>
          <Button disabled={selected.size === 0} onClick={() => handleSendTest('payroll@kounted.ae')}>
            Send Test Email
          </Button>
          <Button disabled={selected.size === 0} onClick={handleSendReview}>
            Send for Review
          </Button>
      </DialogContent>
    </Dialog>
  )
}

// --- Detailed generator: one line per employee, per pay type, per employer ---
function generateDetailedJournalCSV(employer: string, rows: any[]) {
  const fields = [
    'basic_salary',
    'housing_allowance',
    'flight_allowance',
    'transport_allowance',
    'general_allowance',
    'education_allowance',
    'other_allowance',
    'gratuity_eosb',
    'bonus',
    'overtime',
    'salary_in_arrears',
    'expenses_deductions',
    'other_reimbursements',
    'expense_reimbursements'
  ]
  const date = rows[0]?.pay_period_to ?? ''
  const reference = `${date?.slice(0, 7)} Payroll`

  // For each employee, for each field, output a row if nonzero
  const detailRows: string[][] = []
  rows.forEach(employeeRow => {
    fields.forEach(field => {
      const value = parseFloat(employeeRow[field] || 0)
      if (!value) return
      detailRows.push([
        date,
        reference,
        `${field.replace(/_/g, ' ').toUpperCase()} (${employeeRow.employee_name})`,
        '', '', employeeRow.employee_name,
        value > 0 ? value.toFixed(2) : '', // Debit
        value < 0 ? Math.abs(value).toFixed(2) : '', // Credit (if negative)
        '', '', '', '', '', ''
      ])
    })
  })
  // Add net salary per employee as credit line
  rows.forEach(employeeRow => {
    const net = parseFloat(employeeRow.net_salary || 0)
    if (!net) return
    detailRows.push([
      date,
      reference,
      `NET SALARY (${employeeRow.employee_name})`,
      '', '', employer,
      '', // Debit
      net.toFixed(2), // Credit
      '', '', '', '', '', ''
    ])
  })

  const header = [
    'Date', 'Reference', 'Description', 'Account Code', 'Account Name', 'Contact Name',
    'Debit', 'Credit', 'Tracking Name 1', 'Tracking Option 1', 'Tracking Name 2',
    'Tracking Option 2', 'Tax Type', 'Journal Line'
  ]
  return [header, ...detailRows].map(row => row.join(',')).join('\r\n')
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
