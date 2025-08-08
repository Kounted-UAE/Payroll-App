'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'

type ExportXeroJournalsWizardProps = {
  payrollRows: any[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportXeroJournalsWizard({ payrollRows, open, onOpenChange }: ExportXeroJournalsWizardProps) {
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
      const csv = generateJournalCSV(employer, rows)
      const filename = String(employer).replace(/[^a-z0-9]/gi, '_') + '_payrun_journal.csv'
      downloadCSV(csv, filename)
    })
    if (onOpenChange) onOpenChange(false)
  }

  const handleSendTest = async (testEmail: string) => {
    for (const employer of Array.from(selected)) {
      const rows = payrollRows.filter(r => String(r.employer_name) === employer)
      const csv = generateJournalCSV(employer, rows)
      const filename = String(employer).replace(/[^a-z0-9]/gi, '_') + '_payrun_journal.csv'
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
      const reviewerEmail = rows[0]?.reviewer_email ?? null;
      if (!reviewerEmail) {
        alert(`Reviewer email not found for ${employer}`)
        continue
      }
      const csv = generateJournalCSV(employer, rows)
      const filename = String(employer).replace(/[^a-z0-9]/gi, '_') + '_payrun_journal.csv'
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
        <DialogFooter className="flex justify-end gap-2 mt-6">
          <Button disabled={selected.size === 0} onClick={handleExport}>
            Generate Export
          </Button>
          <Button disabled={selected.size === 0} onClick={() => handleSendTest('payroll@kounted.ae')}>
            Send Test Email
          </Button>
          <Button disabled={selected.size === 0} onClick={handleSendReview}>
            Send for Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -- Helper: Generates CSV for a single employer
function generateJournalCSV(employer: string, rows: any[]) {
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
  ];
  const date = rows[0]?.pay_period_to ?? '';
  const reference = `${date?.slice(0, 7)} Payroll`;

  // Aggregate debits (per type)
  const debitRows = fields.map(field => {
    const sum = rows.reduce((acc, r) => acc + (parseFloat(r?.[field] || '0') || 0), 0);
    if (!sum) return null;
    return [
      date, reference, field.replace(/_/g, ' ').toUpperCase(),
      '', '', employer, sum.toFixed(2), '', '', '', '', '', '', ''
    ];
  }).filter((row): row is string[] => row !== null);

  // Net pay as credit
  const totalNet = rows.reduce((acc, r) => acc + (parseFloat(r?.net_salary || '0') || 0), 0);
  const creditRow = [
    date, reference, 'NET SALARY', '', '', employer, '', totalNet.toFixed(2),
    '', '', '', '', '', ''
  ];

  const header = [
    'Date', 'Reference', 'Description', 'Account Code', 'Account Name', 'Contact Name',
    'Debit', 'Credit', 'Tracking Name 1', 'Tracking Option 1', 'Tracking Name 2',
    'Tracking Option 2', 'Tax Type', 'Journal Line'
  ];
  return [header, ...debitRows, creditRow].map(row => row.join(',')).join('\r\n');
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
