'use client'

import React, { useState } from "react"
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
  Building,
  Users,
  DollarSign,
  FileText,
  Play,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  MoreHorizontal
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
} from "@tanstack/react-table"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  
  const { toast } = useToast()
  const { 
    payruns, 
    loading, 
    error, 
    closePayrun 
  } = usePayrollPayruns()

  // Transform payruns data to match schema
  const tableData: Payrun[] = payruns.map(payrun => ({
    id: payrun.id,
    employer_name: payrun.payroll_objects_employers?.legal_name || 'Unknown Employer',
    pay_period_start: payrun.pay_period_start,
    pay_period_end: payrun.pay_period_end,
    created_at: payrun.created_at,
    updated_at: payrun.updated_at,
    processed_at: payrun.processed_at,
    status: payrun.status as "draft" | "locked" | "processing" | "completed",
  }))

  // Table columns definition
  const columns: ColumnDef<Payrun>[] = [
    {
      accessorKey: "employer_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Employer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("employer_name")}</div>,
    },
    {
      accessorKey: "pay_period_start",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Period Start
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{new Date(row.getValue("pay_period_start")).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "pay_period_end",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Period End
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{new Date(row.getValue("pay_period_end")).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={getStatusColor(status)}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Created
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{new Date(row.getValue("created_at")).toLocaleDateString()}</div>,
    },
    {
      accessorKey: "processed_at",
      header: "Processed",
      cell: ({ row }) => {
        const processedAt = row.getValue("processed_at") as string | undefined
        return processedAt ? <div>{new Date(processedAt).toLocaleDateString()}</div> : <div className="text-muted-foreground">-</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payrun = row.original
        const StatusIcon = getStatusIcon(payrun.status)

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payrun.id)}
              >
                Copy payrun ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/backyard/payroll/payruns/${payrun.id}`} className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              {payrun.status === "draft" && (
                <DropdownMenuItem
                  onClick={() => handleClosePayrun(payrun.id, payrun.employer_name)}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Process Payrun
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Link href={`/backyard/payroll/payslips?payrun=${payrun.id}`} className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  View Payslips
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/backyard/payroll/reports?payrun=${payrun.id}`} className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Initialize table
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

  // Update table filter when search query changes
  React.useEffect(() => {
    table.getColumn("employer_name")?.setFilterValue(searchQuery)
  }, [searchQuery, table])

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

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Error Loading Payruns</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">Payruns</h1>
          <p className="text-muted-foreground">
            Process and manage monthly payroll calculations
          </p>
        </div>
        <Link href="/backyard/payroll/payruns/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Payrun
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employer or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Payrun Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-8" /> : payruns.filter(p => p.status === "draft").length}
                </p>
                <p className="text-sm text-muted-foreground">Draft Payruns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-8" /> : payruns.filter(p => p.status === "processing").length}
                </p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-8" /> : payruns.filter(p => p.status === "locked").length}
                </p>
                <p className="text-sm text-muted-foreground">Locked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-8" /> : payruns.filter(p => p.status === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Payruns Table */}
      {!loading && (
        <div className="space-y-4">
          {/* Table Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Filter employers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Calendar className="h-8 w-8 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">No payruns found</h3>
                        <p className="text-muted-foreground">
                          {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first payrun"}
                        </p>
                        <Link href="/backyard/payroll/payruns/new">
                          <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create First Payrun
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayrollPayruns