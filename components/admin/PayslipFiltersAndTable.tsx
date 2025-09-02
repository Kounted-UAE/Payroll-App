'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, X } from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { toast } from '@/hooks/use-toast'
import { ExportXeroJournalsWizard } from '@/components/wizards/payroll-wizards/PayrunSummaryJournalExport'
import { ExportDetailedXeroJournalsWizard } from '@/components/wizards/payroll-wizards/PayrunDetailedJournalExport'
import { CreatePayrunWizard } from '@/components/wizards/payroll-wizards/CreatePayrunWizard'

const SUPABASE_PUBLIC_URL = 'https://alryjvnddvrrgbuvednm.supabase.co/storage/v1/object/public/generated-pdfs/payslips'

export type PayslipRow = {
  batch_id: string
  employee_name: string
  employer_name: string
  reviewer_email: string
  email_id: string
  payslip_url: string
  payslip_token: string
  created_at: string
  pay_period_to: string | null
}

interface PayslipFiltersAndTableProps {
  rows: PayslipRow[]
  selected: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  onProceedToEmail: () => void
  journalWizardOpen: boolean
  setJournalWizardOpen: (open: boolean) => void
  detailedWizardOpen: boolean
  setDetailedWizardOpen: (open: boolean) => void
  onPayrunSuccess?: () => void
}

export function PayslipFiltersAndTable({
  rows,
  selected,
  onSelectionChange,
  onProceedToEmail,
  journalWizardOpen,
  setJournalWizardOpen,
  detailedWizardOpen,
  setDetailedWizardOpen,
  onPayrunSuccess,
}: PayslipFiltersAndTableProps) {
  const [search, setSearch] = useState('')
  const [selectedEmployers, setSelectedEmployers] = useState<Set<string>>(new Set())
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [payrunWizardOpen, setPayrunWizardOpen] = useState(false)

  const downloadZip = async () => {
    const zip = new JSZip()
    const selectedRows = rows.filter(r => selected.has(r.batch_id))

    for (const row of selectedRows) {
      if (!row.payslip_token) continue
      const fileUrl = `${SUPABASE_PUBLIC_URL}/${row.payslip_token}.pdf`
      const res = await fetch(fileUrl)
      const blob = await res.blob()
      zip.file(`${row.payslip_token}.pdf`, blob)
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, 'selected-payslips.zip')
  }

  // Get unique values for filters
  const uniqueEmployers = Array.from(new Set(rows.map(row => row.employer_name).filter(Boolean)))
  const uniqueDates = Array.from(new Set(rows.map(row => row.pay_period_to).filter(Boolean)))

  const filtered = rows.filter(row => {
    // Text search filter
    const matchesSearch = !search || 
      (row.employee_name?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (row.employer_name?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (row.reviewer_email?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (row.email_id?.toLowerCase() ?? '').includes(search.toLowerCase())
    
    // Employer filter
    const matchesEmployer = selectedEmployers.size === 0 || 
      (row.employer_name && selectedEmployers.has(row.employer_name))
    
    // Date filter
    const matchesDate = selectedDates.size === 0 || 
      (row.pay_period_to && selectedDates.has(row.pay_period_to))
    
    return matchesSearch && matchesEmployer && matchesDate
  })

  const toggleSelection = (batchId: string) => {
    const next = new Set(selected)
    next.has(batchId) ? next.delete(batchId) : next.add(batchId)
    onSelectionChange(next)
  }

  // Helper function to check if ZIP download should be enabled
  const isZipDownloadEnabled = () => {
    if (selected.size === 0) return false
    const selectedRows = rows.filter(r => selected.has(r.batch_id))
    return selectedRows.some(r => r.payslip_token)
  }

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Input
            type="text"
            placeholder="Search employee, employer, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm"
          />
          
          {/* Employer Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between min-w-[200px]">
                {selectedEmployers.size === 0 
                  ? "All Employers" 
                  : `${selectedEmployers.size} employer${selectedEmployers.size !== 1 ? 's' : ''}`
                }
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search employers..." />
                <CommandList>
                  <CommandEmpty>No employers found.</CommandEmpty>
                  <CommandGroup>
                    {uniqueEmployers.map((employer) => (
                      <CommandItem
                        key={employer}
                        onSelect={() => {
                          setSelectedEmployers(prev => {
                            const next = new Set(prev)
                            if (next.has(employer)) {
                              next.delete(employer)
                            } else {
                              next.add(employer)
                            }
                            return next
                          })
                        }}
                      >
                        <Checkbox
                          checked={selectedEmployers.has(employer)}
                          className="mr-2"
                        />
                        {employer}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Date Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between min-w-[200px]">
                {selectedDates.size === 0 
                  ? "All Dates" 
                  : `${selectedDates.size} date${selectedDates.size !== 1 ? 's' : ''}`
                }
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search dates..." />
                <CommandList>
                  <CommandEmpty>No dates found.</CommandEmpty>
                  <CommandGroup>
                    {uniqueDates.map((date) => (
                      <CommandItem
                        key={date}
                        onSelect={() => {
                          setSelectedDates(prev => {
                            const next = new Set(prev)
                            if (next.has(date)) {
                              next.delete(date)
                            } else {
                              next.add(date)
                            }
                            return next
                          })
                        }}
                      >
                        <Checkbox
                          checked={selectedDates.has(date)}
                          className="mr-2"
                        />
                        {date}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          {(search || selectedEmployers.size > 0 || selectedDates.size > 0) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSearch('')
                setSelectedEmployers(new Set())
                setSelectedDates(new Set())
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Active Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {Array.from(selectedEmployers).map((employer) => (
            <Badge key={employer} variant="secondary" className="gap-1">
              {employer}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSelectedEmployers(prev => {
                    const next = new Set(prev)
                    next.delete(employer)
                    return next
                  })
                }}
              />
            </Badge>
          ))}
          {Array.from(selectedDates).map((date) => (
            <Badge key={date} variant="secondary" className="gap-1">
              {date}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSelectedDates(prev => {
                    const next = new Set(prev)
                    next.delete(date)
                    return next
                  })
                }}
              />
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-cyan-600">
            Showing {filtered.length} result{filtered.length !== 1 && 's'} of {rows.length} total
            {selected.size > 0 && (
              <span className="ml-2">
                • {selected.size} of {rows.length} selected
              </span>
            )}
          </div>
          {selected.size > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onSelectionChange(new Set())}
            >
              Clear All Selections
            </Button>
          )}
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={onProceedToEmail}
            disabled={!selected.size}
            variant="default"
          >
            Send to Email
          </Button>
          <Button
            variant="outline"
            onClick={downloadZip}
            disabled={!isZipDownloadEnabled()}
          >
            Download Selected (ZIP)
          </Button>
          <Button
            variant="outline"
            onClick={() => setPayrunWizardOpen(true)}
            disabled={!selected.size}
          >
            Create New Payrun
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setDetailedWizardOpen(true)} variant="default">
            Export Xero Detailed Journals
          </Button>
          <Button
            variant="default"
            onClick={() => setJournalWizardOpen(true)}
          >
            Export Xero Summary Journals
          </Button>
        </div>
      </div>

      {/* Wizard Components */}
      <ExportDetailedXeroJournalsWizard
        open={detailedWizardOpen}
        onOpenChange={setDetailedWizardOpen}
        payrollRows={rows}
      />
      <ExportXeroJournalsWizard
        open={journalWizardOpen}
        onOpenChange={setJournalWizardOpen}
        payrollRows={rows}
      />
      <CreatePayrunWizard
        open={payrunWizardOpen}
        onOpenChange={setPayrunWizardOpen}
        selectedRows={rows.filter(r => selected.has(r.batch_id))}
        onSuccess={() => {
          onPayrunSuccess?.()
          onSelectionChange(new Set()) // Clear selections after success
        }}
      />

      {/* Table Section */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={filtered.every(r => selected.has(r.batch_id))}
                indeterminate={
                  filtered.some(r => selected.has(r.batch_id)) &&
                  !filtered.every(r => selected.has(r.batch_id))
                }
                onCheckedChange={(checked) => {
                  const next = new Set(selected)
                  filtered.forEach(row => {
                    if (checked) {
                      next.add(row.batch_id)
                    } else {
                      next.delete(row.batch_id)
                    }
                  })
                  onSelectionChange(next)
                }}
              />
            </TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Employer</TableHead>
            <TableHead>Reviewer Email</TableHead>
            <TableHead>Live Email</TableHead>
            <TableHead>Pay Period To</TableHead>
            <TableHead>Payslip</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(row => (
            <TableRow key={row.batch_id}>
              <TableCell>
                <Checkbox
                  checked={selected.has(row.batch_id)}
                  onCheckedChange={() => toggleSelection(row.batch_id)}
                />
              </TableCell>
              <TableCell>{row.employee_name}</TableCell>
              <TableCell>{row.employer_name}</TableCell>
              <TableCell>{row.reviewer_email}</TableCell>
              <TableCell>{row.email_id}</TableCell>
              <TableCell>{row.pay_period_to || 'N/A'}</TableCell>
              <TableCell>
                {row.payslip_token ? (
                  <a
                    href={`${SUPABASE_PUBLIC_URL}/${row.payslip_token}.pdf`}
                    target="_blank"
                    className="text-blue-600 underline text-xs"
                  >
                    View PDF
                  </a>
                ) : (
                  <span className="text-cyan-600 text-xs">Not available</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


    </div>
  )
}
