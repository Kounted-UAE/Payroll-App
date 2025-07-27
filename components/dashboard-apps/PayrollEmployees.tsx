// components/dashboard-apps/PayrollEmployees.tsx

'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { usePayrollEmployees } from "@/hooks/usePayroll"
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Upload,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BulkImportExportDialog } from "@/components/bulk/BulkImportExportDialog"
import {
  employeeCsvSchema,
  EMPLOYEE_CSV_TEMPLATE,
  EMPLOYEE_EXAMPLE_ROW
} from "@/lib/validators/employeeCsvSchema"
import { ViewToggle } from "@/components/ui/ViewToggle"

const PayrollEmployees = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const {
    employees,
    loading,
    error,
    deleteEmployee
  } = usePayrollEmployees()

  const filteredEmployees = employees.filter(employee =>
    employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (employee.emirates_id && employee.emirates_id.includes(searchQuery)) ||
    (employee.job_title && employee.job_title.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleDeleteEmployee = async (id: string, name: string) => {
    try {
      await deleteEmployee(id)
      toast({
        title: "Employee deleted",
        description: `${name} has been successfully deleted.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage employee profiles and their employment details
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ViewToggle view={view} setView={setView} />
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Bulk Import/Export
          </Button>
          <Link href="/backyard/payroll/employees/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        </div>
      </div>

      <BulkImportExportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        objectName="Employee"
        tableName="payroll_objects_employees"
        schema={employeeCsvSchema}
        templateHeaders={EMPLOYEE_CSV_TEMPLATE}
        exampleRow={EMPLOYEE_EXAMPLE_ROW}
      />

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, Emirates ID, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              Filter by Employer
            </Button>
            <Button variant="outline">
              Filter by Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Grid View */}
      {!loading && view === 'grid' && (
        <div className="grid gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id}>
              <CardHeader>
                <CardTitle className="text-sm">{employee.full_name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {employee.job_title} • {employee.emirates_id}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="text-xs">
                  <div>Status: <Badge>{employee.status || 'Active'}</Badge></div>
                  <div>Nationality: {employee.nationality || '—'}</div>
                  <div>Start Date: {employee.start_date || '—'}</div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEmployee(employee.id, employee.full_name)}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && view === 'list' && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Emirates ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.full_name}</TableCell>
                <TableCell>{employee.job_title}</TableCell>
                <TableCell>{employee.emirates_id}</TableCell>
                <TableCell>
                  <Badge>{employee.status || 'Active'}</Badge>
                </TableCell>
                <TableCell>{employee.start_date}</TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id, employee.full_name)}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!loading && filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xs font-semibold mb-2">No employees found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first employee"}
            </p>
            <Link href="/backyard/payroll/employees/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add First Employee
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PayrollEmployees
