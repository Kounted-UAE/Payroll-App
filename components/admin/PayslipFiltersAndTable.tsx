'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table'
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
import { ChevronDown, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { toast } from '@/hooks/use-toast'
import { ExportXeroJournalsWizard } from '@/components/advontier-payroll/actions/PayrunSummaryJournalExport'
import { ExportDetailedXeroJournalsWizard } from '@/components/advontier-payroll/actions/PayrunDetailedJournalExport'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationLink } from '@/components/ui/pagination'
import { generatePayslipFilename, extractTokenFromFilename } from '@/lib/utils/pdf/payslipNaming'

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
  last_sent_at?: string | null
}

interface PayslipFiltersAndTableProps {
  rows: PayslipRow[]
  selected: Set<string>
  onSelectionChange: (selected: Set<string>) => void
  onProceedToEmail: () => void
  onProceedToGenerate?: () => void
  onFilteredRowsChange?: (filteredRows: PayslipRow[]) => void
  journalWizardOpen: boolean
  setJournalWizardOpen: (open: boolean) => void
  detailedWizardOpen: boolean
  setDetailedWizardOpen: (open: boolean) => void
  onPayrunSuccess?: () => void
  total?: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  onSort?: (field: string) => void
  onClearSort?: () => void
}

export function PayslipFiltersAndTable({
  rows,
  selected,
  onSelectionChange,
  onProceedToEmail,
  onProceedToGenerate,
  onFilteredRowsChange,
  journalWizardOpen,
  setJournalWizardOpen,
  detailedWizardOpen,
  setDetailedWizardOpen,
  onPayrunSuccess,
  total = 0,
  page = 1,
  pageSize = 200,
  onPageChange,
  onPageSizeChange,
  sortBy = 'created_at',
  sortDir = 'desc',
  onSort,
  onClearSort,
}: PayslipFiltersAndTableProps) {
  const [search, setSearch] = useState('')
  const [selectedEmployers, setSelectedEmployers] = useState<Set<string>>(new Set())
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())

  const downloadZip = async () => {
    const zip = new JSZip()
    const selectedRows = rows.filter(r => selected.has(r.batch_id))

    for (const row of selectedRows) {
      if (!row.payslip_token) continue
      const filename = generatePayslipFilename(row.employee_name || 'unknown', row.payslip_token)
      const fileUrl = `${SUPABASE_PUBLIC_URL}/${filename}`
      const res = await fetch(fileUrl)
      const blob = await res.blob()
      zip.file(filename, blob)
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, 'selected-payslips.zip')
  }

  // Get unique values for filters
  const uniqueEmployers = Array.from(new Set(rows.map(row => row.employer_name).filter(Boolean)))
  // Date options should reflect current search + employer filters (but not current date filter)
  const dateOptionSource = rows.filter(row => {
    const matchesSearch = !search || 
      (row.employee_name?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (row.employer_name?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (row.reviewer_email?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (row.email_id?.toLowerCase() ?? '').includes(search.toLowerCase())

    const matchesEmployer = selectedEmployers.size === 0 || 
      (row.employer_name && selectedEmployers.has(row.employer_name))

    return matchesSearch && matchesEmployer
  })
  const uniqueDates = Array.from(new Set(dateOptionSource.map(row => row.pay_period_to || '').filter(Boolean)))

  const filtered = useMemo(() => {
    return rows.filter(row => {
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
        ((row.pay_period_to || '') && selectedDates.has(row.pay_period_to || ''))
      
      return matchesSearch && matchesEmployer && matchesDate
    })
  }, [rows, search, selectedEmployers, selectedDates])

  const selectedInFiltered = useMemo(() => {
    return filtered.filter(r => selected.has(r.batch_id)).length
  }, [filtered, selected])

  // Notify parent of filtered rows changes
  useEffect(() => {
    onFilteredRowsChange?.(filtered)
  }, [filtered]) // onFilteredRowsChange should be stable, don't include in deps

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

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize))

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return <ArrowUpDown className="h-3 w-3 opacity-50" />
    return sortDir === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  const HeaderButton = ({ field, label }: { field: string; label: string }) => (
    <button
      className="inline-flex items-center gap-1 hover:underline"
      onClick={() => onSort?.(field)}
      type="button"
    >
      <span>{label}</span>
      <SortIcon field={field} />
    </button>
  )

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap text-slate-600">
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
              <Button variant="outline" className="justify-between min-w-[200px] bg-blue-100">
                {selectedEmployers.size === 0 
                  ? "All Employers" 
                  : `${selectedEmployers.size} employer${selectedEmployers.size !== 1 ? 's' : ''}`
                }
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-slate-800 text-white">
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
          <Popover >
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-between min-w-[200px] bg-blue-100">
                {selectedDates.size === 0 
                  ? "All Dates" 
                  : `${selectedDates.size} date${selectedDates.size !== 1 ? 's' : ''}`
                }
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0 bg-slate-800 text-white">
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

          {onClearSort && (
            <Button variant="ghost" size="sm" onClick={onClearSort}>Clear Sort</Button>
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
          <div className="text-sm text-slate-600 font-bold">
            Showing {filtered.length} result{filtered.length !== 1 && 's'} of {total || rows.length} total
            {selectedInFiltered > 0 && (
              <span className="ml-2">
                • {selectedInFiltered} selected
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
          
          
          <Button onClick={() => setDetailedWizardOpen(true)} variant="default">
            Export Xero Detailed Journals
          </Button>
          <Button
            variant="default"
            onClick={() => setJournalWizardOpen(true)}
          >
            Export Xero Summary Journals
          </Button>
          <Button
            variant="default"
            onClick={downloadZip}
            disabled={!isZipDownloadEnabled()}
          >
            Download Selected (ZIP)
          </Button>
          <Button
            variant="default"
            onClick={() => onProceedToGenerate?.()}
            disabled={!selected.size}
          >
            Generate Selected Payslips
          </Button>
          <Button
            onClick={onProceedToEmail}
            disabled={!selected.size}
            variant="default"
          >
            Send to Email
          </Button>
        </div>
        <div className="flex items-center gap-2">
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-600">Rows per page</span>
            <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange?.(Number(v))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white">
                <SelectItem value="50" >50</SelectItem>
                <SelectItem value="200">200</SelectItem>
                <SelectItem value="1000">1000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* Table Section */}
      <Table>
        <TableHeader className="bg-slate-800 text-white">
          <TableRow>
            <TableHead >
              <Checkbox
                checked={filtered.length > 0 && filtered.every(r => selected.has(r.batch_id))}
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
            </TableHead >
            <TableHead><HeaderButton field="pay_period_to" label="Date" /></TableHead>
            <TableHead><HeaderButton field="employer_name" label="Employer" /></TableHead>
            <TableHead><HeaderButton field="employee_name" label="Employee" /></TableHead>
            <TableHead><HeaderButton field="email_id" label="Email" /></TableHead>
            <TableHead><HeaderButton field="reviewer_email" label="Reviewer" /></TableHead>
            <TableHead>Last Sent</TableHead>
            
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
              <TableCell>{row.pay_period_to || 'N/A'}</TableCell>
              <TableCell>{row.employer_name}</TableCell>
              <TableCell>{row.employee_name}</TableCell>
              <TableCell>{row.email_id}</TableCell>
              <TableCell>{row.reviewer_email}</TableCell>
              <TableCell>
                {row.last_sent_at ? new Date(row.last_sent_at).toLocaleString() : <span className="text-cyan-600 text-xs">Never</span>}
              </TableCell>
              <TableCell>
                {row.payslip_token ? (
                  <a
                    href={`${SUPABASE_PUBLIC_URL}/${generatePayslipFilename(row.employee_name || 'unknown', row.payslip_token)}`}
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

      {/* Footer with pagination */}
      <div className="flex items-center justify-between mt-2">

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={(e) => { e.preventDefault(); onPageChange?.(Math.max(1, page - 1)) }} href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink isActive href="#">{page}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={(e) => { e.preventDefault(); onPageChange?.(Math.min(totalPages, page + 1)) }} href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>


    </div>
  )
}
