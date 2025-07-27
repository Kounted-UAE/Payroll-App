// components/dashboard-apps/PayrollEmployees.tsx

'use client'

import { useState, useEffect  } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge, badgeVariants } from "@/components/ui/badge"
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
  Trash2Icon,
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
import { EmployeeDrawer } from "@/components/drawers/EmployeeDrawer"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"



const PayrollEmployees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employers, setEmployers] = useState<any[]>([]); // For future employer mapping
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit' | 'delete'>('view');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Archived'>('All');
  const [employerFilter, setEmployerFilter] = useState<string | 'All'>('All');
  const [employerSearch, setEmployerSearch] = useState("")

  useEffect(() => {
    const fetchEmployers = async () => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("payroll_objects_employers")
        .select("id, legal_name")
        .order("legal_name", { ascending: true })
  
      if (!error && data) {
        setEmployers(data)
      }
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
        transform={(row) => ({
          ...row,
          // Ensure required fields are present with hardened parsing
          start_date: (() => {
            if (row.start_date && row.start_date.trim() !== '') {
              try {
                // Try to parse and format the date properly
                const date = new Date(row.start_date);
                if (!isNaN(date.getTime())) {
                  return date.toISOString().split('T')[0];
                }
              } catch (e) {
                console.warn('Invalid start_date format:', row.start_date);
              }
            }
            return new Date().toISOString().split('T')[0];
          })(),

          full_name: (() => {
            const name = row.full_name || `${row.first_name || ''} ${row.last_name || ''}`.trim();
            if (!name || name === '') return 'Unknown Employee';

            // Convert to proper case: "ali hussain" → "Ali Hussain"
            return name.toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
          })(),

          // Safe number conversions - ensure null instead of empty strings
          base_salary: row.base_salary && row.base_salary.toString().trim() !== '' ? Number(row.base_salary) : null,
          housing_allowance: row.housing_allowance && row.housing_allowance.toString().trim() !== '' ? Number(row.housing_allowance) : null,
          transport_allowance: row.transport_allowance && row.transport_allowance.toString().trim() !== '' ? Number(row.transport_allowance) : null,
          food_allowance: row.food_allowance && row.food_allowance.toString().trim() !== '' ? Number(row.food_allowance) : null,

          // Enhanced validation - ensure null instead of empty strings
          email: (() => {
            if (!row.email || row.email.trim() === '') return null;
            // Clean and validate email: trim whitespace, convert to lowercase
            const cleanEmail = row.email.trim().toLowerCase();
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(cleanEmail) ? cleanEmail : null;
          })(),

          // Enhanced IBAN validation - ensure null instead of empty strings
          iban: (() => {
            if (!row.iban || row.iban.trim() === '') return null;
            // Basic IBAN format check (starts with 2 letters, then numbers)
            const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
            return ibanRegex.test(row.iban.trim().replace(/\s/g, '')) ? row.iban.trim() : null;
          })(),

          // Handle JSON fields properly (using type assertion for fields not in schema)
          visa_info: (() => {
            const visaInfo = (row as any).visa_info;
            if (!visaInfo || visaInfo.trim() === '') return null;
            try {
              return typeof visaInfo === 'string' ? JSON.parse(visaInfo) : visaInfo;
            } catch (e) {
              console.warn('Invalid visa_info JSON:', visaInfo);
              return null;
            }
          })(),

          other_allowances: (() => {
            const otherAllowances = (row as any).other_allowances;
            if (!otherAllowances || otherAllowances.trim() === '') return null;
            try {
              return typeof otherAllowances === 'string' ? JSON.parse(otherAllowances) : otherAllowances;
            } catch (e) {
              console.warn('Invalid other_allowances JSON:', otherAllowances);
              return null;
            }
          })(),

          // Ensure string fields are null instead of empty strings for optional fields
          emirates_id: row.emirates_id && row.emirates_id.trim() !== '' ? row.emirates_id.trim() : null,
          passport_number: row.passport_number && row.passport_number.trim() !== '' ? row.passport_number.trim() : null,
          nationality: row.nationality && row.nationality.trim() !== '' ? row.nationality.trim() : null,
          job_title: row.job_title && row.job_title.trim() !== '' ? row.job_title.trim() : null,
          contract_type: row.contract_type && row.contract_type.trim() !== '' ? row.contract_type.trim() : null,
          employer_id: row.employer_id && row.employer_id.trim() !== '' ? row.employer_id.trim() : null,
          bank_name: row.bank_name && row.bank_name.trim() !== '' ? row.bank_name.trim() : null,
          routing_code: row.routing_code && row.routing_code.trim() !== '' ? row.routing_code.trim() : null,
          account_number: row.account_number && row.account_number.trim() !== '' ? row.account_number.trim() : null,
          currency: row.currency && row.currency.trim() !== '' ? row.currency.trim() : null,

          // Set defaults for important fields
          status: row.status && row.status.trim() !== '' ? row.status : 'Active',
          created_at: row.created_at && row.created_at.trim() !== '' ? row.created_at : new Date().toISOString(),
          updated_at: new Date().toISOString()
        })}
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
              <CardHeader>
                <CardTitle className="text-sm">{employee.full_name}</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {employee.job_title} • {employee.emirates_id}
                </CardDescription>
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


      {selectedEmployee && (
        <EmployeeDrawer
          employee={selectedEmployee}
          mode={drawerMode}
          open={!!selectedEmployee}
          onOpenChange={() => setSelectedEmployee(null)}
          onDelete={() => handleDeleteEmployee(selectedEmployee.id, selectedEmployee.full_name)}
          onSave={handleUpdateEmployee} // <- ADD THIS
        />
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
