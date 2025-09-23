'use client'

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/react-ui/card"
import { Button } from "@/components/react-ui/button"
import { Input } from "@/components/react-ui/input"
import { Badge, badgeVariants } from "@/components/react-ui/badge"
import { Skeleton } from "@/components/react-ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { usePayrollEmployees } from "@/hooks/usePayroll"
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Upload,
  Trash2Icon,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/react-ui/table"
import { BulkImportExportDialog } from "@/components/admin/BulkImportExportDialog"
import {
  employeeCsvSchema,
  EMPLOYEE_CSV_TEMPLATE,
  EMPLOYEE_EXAMPLE_ROW
} from "@/lib/validators/employeeCsvSchema"
import { ViewToggle } from "@/components/react-ui/ViewToggle"
import { EmployeeDrawer } from "@/components/payroll/EmployeeDrawer"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/react-ui/dropdown-menu"
import { ScrollArea } from "@/components/react-ui/scroll-area"
// IMPORT the salary wizard
import AddSalaryTemplateWizard from "@/components/payroll/actions/AddSalaryTemplateWizard"

const PayrollEmployees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employers, setEmployers] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit' | 'delete'>('view');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Archived'>('All');
  const [employerFilter, setEmployerFilter] = useState<string | 'All'>('All');
  const [employerSearch, setEmployerSearch] = useState("")
  // SALARY WIZARD STATE
  const [salaryWizardOpen, setSalaryWizardOpen] = useState(false)
  const [salaryWizardEmployee, setSalaryWizardEmployee] = useState<any | null>(null)

  useEffect(() => {
    const fetchEmployers = async () => {
      // Only run on client side
      if (typeof window === 'undefined') return

      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("payroll_objects_employers")
        .select("id, legal_name")
        .order("legal_name", { ascending: true })
      if (!error && data) setEmployers(data)
    }
    fetchEmployers()
  }, [])

  const { toast } = useToast()
  const {
    employees,
    loading,
    error,
    deleteEmployee,
    updateEmployee,
  } = usePayrollEmployees()

  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      employee.full_name?.toLowerCase().includes(query) ||
      employee.first_name?.toLowerCase().includes(query) ||
      employee.last_name?.toLowerCase().includes(query) ||
      employee.email?.toLowerCase().includes(query) ||
      employee.emirates_id?.toLowerCase().includes(query) ||
      employee.job_title?.toLowerCase().includes(query) ||
      employee.status?.toLowerCase().includes(query) ||
      employee.termination_date?.toString().includes(query) ||
      employee.start_date?.toString().includes(query) ||
      employee.payroll_objects_employers?.legal_name?.toLowerCase().includes(query)
    const matchesStatus =
      statusFilter === 'All' || employee.status === statusFilter
    const matchesEmployer =
      employerFilter === 'All' || employee.employer_id === employerFilter
    return matchesQuery && matchesStatus && matchesEmployer    
  })

  const handleDeleteEmployee = async (id: string, name: string) => {
    try {
      await updateEmployee(id, { status: 'Archived' });
      toast({
        title: "Employee archived",
        description: `${name} has been marked as Archived.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive employee. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateEmployee = async (updates: Partial<any>) => {
    if (!selectedEmployee?.id) return
    try {
      await updateEmployee(selectedEmployee.id, updates)
      toast({
        title: "Employee updated",
        description: `${selectedEmployee.full_name} has been successfully updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      })
    }
  }

// Handler to open wizard for either all or one employee
const openSalaryWizard = (employee: any | null = null) => {
  setSalaryWizardEmployee(employee)
  setSalaryWizardOpen(true)
}

// Always reset both on close
const closeSalaryWizard = () => {
  setSalaryWizardOpen(false)
  setSalaryWizardEmployee(null)
}


  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg text-zinc-600 font-bold">Employees</h1>
          <p className="text-blue-400">
            Manage employee profiles and their employment details
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ViewToggle view={view} setView={setView} />
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Bulk Import/Export
          </Button>
          {/* NEW: Edit Salaries Button */}
          <Button variant="outline" onClick={() => openSalaryWizard(null)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Salaries
          </Button>
          <Link href="/advontier/payroll/employees/new">
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
        deduplicationKeys={['first_name', 'last_name', 'employer_id']}
        transform={(row) => {
          const fullName = (() => {
            if (row.full_name && row.full_name.trim()) {
              return row.full_name.trim()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
            }
            const firstName = row.first_name?.trim() || '';
            const lastName = row.last_name?.trim() || '';
            const combined = `${firstName} ${lastName}`.trim();
            if (!combined) {
              throw new Error('First name and last name are required to construct full name');
            }
            return combined
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
          })();
          const startDate = (() => {
            if (!row.start_date || row.start_date.trim() === '') {
              return new Date().toISOString().split('T')[0];
            }
            const cleanInput = row.start_date.trim();
            if (cleanInput.includes('/')) {
              const parts = cleanInput.split('/');
              if (parts.length === 3) {
                const [day, month, year] = parts;
                const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                const date = new Date(iso);
                if (!isNaN(date.getTime())) {
                  return date.toISOString().split('T')[0];
                }
              }
            }
            return new Date().toISOString().split('T')[0];
          })();
          return {
            full_name: fullName,
            start_date: startDate,
            first_name: row.first_name?.trim() || '',
            last_name: row.last_name?.trim() || '',
            email: (() => {
              if (!row.email || row.email.trim() === '') return '';
              const cleanEmail = row.email.trim().toLowerCase();
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return emailRegex.test(cleanEmail) ? cleanEmail : '';
            })(),
            emirates_id: row.emirates_id?.trim() || '',
            passport_number: row.passport_number?.trim() || '',
            nationality: row.nationality?.trim() || '',
            employer_id: row.employer_id?.trim() || '',
            bank_name: row.bank_name?.trim() || '',
            iban: row.iban?.trim() || '',
            status: row.status?.trim() || 'Active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }}
      />

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
              <Input
                placeholder="Search by name, Emirates ID, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Filter by Employer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2">
                <Input
                  placeholder="Search employer..."
                  value={employerSearch}
                  onChange={(e) => setEmployerSearch(e.target.value)}
                  className="mb-2"
                />
                <ScrollArea className="max-h-60">
                  <DropdownMenuItem onClick={() => setEmployerFilter('All')}>
                    All Employers
                  </DropdownMenuItem>
                  {employers
                    .filter(emp =>
                      emp.legal_name?.toLowerCase().includes(employerSearch.toLowerCase())
                    )
                    .map((employer) => (
                      <DropdownMenuItem
                        key={employer.id}
                        onClick={() => setEmployerFilter(employer.id)}
                      >
                        {employer.legal_name || 'Unnamed'}
                      </DropdownMenuItem>
                    ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Filter by Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {['All', 'Active', 'Inactive', 'Archived'].map(status => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status as any)}
                    className="cursor-pointer"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
              <CardHeader className="flex flex-row items-center space-x-3">
                {/* 'Add/Edit Salary' LINK */}
                <Button
                  variant="link"
                  className="p-0 text-xs font-medium text-blue-500 hover:underline"
                  onClick={() => openSalaryWizard(employee)}
                >
                  add/edit salary
                </Button>
                <div>
                  <CardTitle className="text-sm">{employee.full_name}</CardTitle>
                  <CardDescription className="text-xs text-blue-200">
                    {employee.job_title} • {employee.emirates_id}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="text-xs">
                  <div>Status: <Badge
                    variant={
                      employee.status === 'Archived'
                        ? 'destructive'
                        : employee.status === 'Inactive'
                          ? 'warning'
                          : 'default'
                    }
                  >
                    {employee.status || 'Active'}
                  </Badge>
                  </div>
                  <div>Nationality: {employee.nationality || '—'}</div>
                  <div>Start Date: {employee.start_date || '—'}</div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedEmployee(employee);
                    setDrawerMode('view');
                  }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedEmployee(employee);
                    setDrawerMode('edit');
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedEmployee(employee);
                    setDrawerMode('delete');
                  }}>
                    <Trash2Icon className="h-4 w-4" />
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
              <TableHead></TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Employer</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Termination Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                {/* 'Add/Edit Salary' LINK */}
                <TableCell>
                  <Button
                    variant="link"
                    className="p-0 text-xs font-medium text-blue-500 hover:underline"
                    onClick={() => openSalaryWizard(employee)}
                  >
                    add/edit salary
                  </Button>
                </TableCell>
                <TableCell>{employee.first_name}</TableCell>
                <TableCell>{employee.last_name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.payroll_objects_employers?.legal_name || '—'}</TableCell>
                <TableCell>{employee.start_date || '—'}</TableCell>
                <TableCell>{employee.termination_date || '—'}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      employee.status === 'Archived'
                        ? 'destructive'
                        : employee.status === 'Inactive'
                          ? 'warning'
                          : 'default'
                    }
                  >
                    {employee.status || 'Active'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => {
                      setSelectedEmployee(employee);
                      setDrawerMode('view');
                    }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setSelectedEmployee(employee);
                      setDrawerMode('edit');
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setSelectedEmployee(employee);
                      setDrawerMode('delete');
                    }}>
                      <Trash2Icon className="h-4 w-4 text-red-700" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Employee Drawer */}
      {selectedEmployee && (
        <EmployeeDrawer
          employee={selectedEmployee.id}
          mode={drawerMode}
          open={!!selectedEmployee}
          onOpenChange={() => setSelectedEmployee(null)}
          onDelete={() => handleDeleteEmployee(selectedEmployee.id, selectedEmployee.full_name)}
          onSave={handleUpdateEmployee}
        />
      )}

      {/* Salary Wizard Modal */}
      {salaryWizardOpen && (
  <AddSalaryTemplateWizard
    employeeId={salaryWizardEmployee?.id || ''}
    onComplete={() => {
      closeSalaryWizard()
      // Optionally refresh employee data or show success message
    }}
    onCancel={() => {
      closeSalaryWizard()
    }}
  />
)}

      {!loading && filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-blue-200 mx-auto mb-4" />
            <h3 className="text-xs font-semibold mb-2">No employees found</h3>
            <p className="text-blue-200 mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first employee"}
            </p>
            <Link href="/advontier/payroll/employees/new">
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
