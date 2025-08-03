// PayrollPayruns.tsx

'use client'

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { usePayrollPayruns } from "@/hooks/usePayroll"
import {
  Calendar,
  Search,
  Plus,
  Eye,
  Lock,
  Download,
  FileText,
  Play,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  MoreHorizontal,
  LayoutGrid,
  List as ListIcon,
  Edit
} from "lucide-react"
import Link from "next/link"
import { z } from "zod"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ViewToggle } from "@/components/ui/ViewToggle";
import { BulkImportExportDialog } from '@/components/bulk/BulkImportExportDialog';
import { payrunCsvSchema, PAYRUN_CSV_TEMPLATE, PAYRUN_EXAMPLE_ROW } from '@/lib/validators/payrunCsvSchema';
import { useState as useClientState } from 'react';

// Payrun Schema using Zod
const PayrunSchema = z.object({
  id: z.string(),
  employer_name: z.string(),
  pay_period_start: z.string(),
  pay_period_end: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  processed_at: z.string().optional(),
  status: z.enum(["draft", "locked", "processing", "completed"]),
})

type Payrun = z.infer<typeof PayrunSchema>

const PayrollPayruns = () => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [dialogOpen, setDialogOpen] = useClientState(false);
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const { toast } = useToast()
  const {
    payruns,
    loading,
    error,
    closePayrun,
  } = usePayrollPayruns()

  // TODO: Implement usePayrollStats hook for dashboard statistics

  // Memoize columns and tableData for performance
  const columns = useMemo<ColumnDef<Payrun>[]>(() => [
    {
      accessorKey: "employer_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold"
        >
          Employer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("employer_name")}</div>,
    },
    // ... other columns ...
  ], [/* dependencies if any */])

  const tableData = useMemo<Payrun[]>(() => payruns.map(payrun => ({
    id: payrun.id,
    employer_name: payrun.payroll_objects_employers?.legal_name || 'Unknown Employer',
    pay_period_start: payrun.pay_period_start,
    pay_period_end: payrun.pay_period_end,
    created_at: payrun.created_at,
    updated_at: payrun.updated_at,
    processed_at: payrun.processed_at,
    status: payrun.status as "draft" | "locked" | "processing" | "completed",
  })), [payruns])

  // Call useReactTable at the top level
  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "completed": return "default"
      case "locked": return "secondary"
      case "processing": return "destructive"
      case "draft": return "outline"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "completed": return CheckCircle
      case "locked": return Lock
      case "processing": return Play
      case "draft": return FileText
      default: return FileText
    }
  }

  const handleClosePayrun = async (id: string, name: string) => {
    try {
      await closePayrun(id)
      toast({
        title: "Payrun closed",
        description: `${name} has been successfully closed.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close payrun. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Recent activity: last 5 payruns (sorted by updated_at)
  const recentActivity = useMemo(() =>
    [...payruns]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5),
    [payruns]
  )

  const searchValue = (columnFilters.find(f => f.id === "employer_name")?.value as string) ?? ""

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-xs font-bold">Error Loading Payruns</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Payruns</h1>
          <p className="text-md text-muted-foreground">
            Process and manage monthly payroll calculations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ViewToggle view={view} setView={setView} />
          <BulkImportExportDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            objectName="Payrun"
            tableName="payroll_payrun_records"
            schema={payrunCsvSchema}
            templateHeaders={PAYRUN_CSV_TEMPLATE}
            exampleRow={PAYRUN_EXAMPLE_ROW}
          />
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Bulk Import/Export
          </Button>
          <Link href="/backyard/payroll/payruns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Payrun
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground">Total Employers</div>
              <div className="text-2xl font-bold">-</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground">Total Employees</div>
              <div className="text-2xl font-bold">-</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground">Active Payruns</div>
              <div className="text-2xl font-bold">-</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground">Monthly Payroll</div>
              <div className="text-2xl font-bold">-</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payrun Activity</CardTitle>
          <CardDescription>Latest changes to payruns</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {recentActivity.length === 0 && <li className="py-2 text-muted-foreground text-xs">No recent activity</li>}
            {recentActivity.map((payrun) => (
              <li key={payrun.id} className="py-2 flex items-center gap-4">
                <span className="font-semibold text-xs">{payrun.payroll_objects_employers?.legal_name || 'Unknown Employer'}</span>
                <span className="text-xs">{new Date(payrun.updated_at).toLocaleString()}</span>
                <Badge variant={getStatusColor(payrun.status)}>{payrun.status}</Badge>
                <Link href={`/backyard/payroll/payruns/${payrun.id}`} className="ml-auto text-primary underline text-xs">View</Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employer or status..."
                value={searchValue}
                onChange={(e) => setColumnFilters([{ id: "employer_name", value: e.target.value }])}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              Filter by Status
            </Button>
            <Button variant="outline">
              Filter by Period
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payruns Grid/List */}
      {!loading && view === 'grid' && (
        <div className="grid gap-6">
          {/* Render payrun cards here (similar to Employees/Employers grid) */}
          {/* ... implement as needed ... */}
        </div>
      )}
      {!loading && view === 'list' && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employer</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((payrun) => (
              <TableRow key={payrun.id}>
                <TableCell>{payrun.employer_name}</TableCell>
                <TableCell>{payrun.pay_period_start} - {payrun.pay_period_end}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(payrun.status)}>{payrun.status}</Badge>
                </TableCell>
                <TableCell>{new Date(payrun.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Table and Pagination (existing code) */}
      {/* ... keep your table and pagination code here ... */}
    </div>
  )
}

export default PayrollPayruns
