'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Calendar,
  Building,
  CreditCard,
  FileText,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

const PayrollEmployees = () => {
  const [searchQuery, setSearchQuery] = useState("")
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

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "active": return "default"
      case "inactive": return "secondary"
      case "terminated": return "destructive"
      default: return "secondary"
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Error Loading Employees</h1>
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
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage employee profiles and their employment details
          </p>
        </div>
        <Link href="/backyard/payroll/employees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
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
                placeholder="Search by name, Emirates ID, job title, or employer..."
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

      {/* Employee Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-12" /> : employees.filter(e => e.status === "active").length}
                </p>
                <p className="text-sm text-muted-foreground">Active Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-12" /> : employees.filter(e => e.status === "inactive").length}
                </p>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-12" /> : new Set(employees.map(e => e.employer_id)).size}
                </p>
                <p className="text-sm text-muted-foreground">Employers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? <Skeleton className="h-8 w-12" /> : employees.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
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
                    <Skeleton className="h-12 w-12 rounded-full" />
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
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Employees List */}
      {!loading && (
        <div className="grid gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/avatars/${employee.id}.jpg`} />
                      <AvatarFallback>{getInitials(employee.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{employee.full_name}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        {employee.job_title && <span>{employee.job_title}</span>}
                        {employee.job_title && <span>•</span>}
                        {employee.emirates_id && <span>EID: {employee.emirates_id}</span>}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(employee.status)}>
                      {employee.status || 'Unknown'}
                    </Badge>
                    {employee.nationality && (
                      <Badge variant="outline">
                        {employee.nationality}
                      </Badge>
                    )}
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Employment Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Start Date:</span>
                        <span className="text-sm font-medium">{employee.start_date}</span>
                      </div>
                      {employee.contract_type && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Contract:</span>
                          <span className="text-sm font-medium">{employee.contract_type}</span>
                        </div>
                      )}
                      {employee.termination_date && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Termination:</span>
                          <span className="text-sm font-medium">{employee.termination_date}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Identification
                    </h4>
                    <div className="space-y-2">
                      {employee.emirates_id && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Emirates ID:</span>
                          <span className="text-sm font-medium">{employee.emirates_id}</span>
                        </div>
                      )}
                      {employee.passport_number && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Passport:</span>
                          <span className="text-sm font-medium">{employee.passport_number}</span>
                        </div>
                      )}
                      {employee.nationality && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Nationality:</span>
                          <span className="text-sm font-medium">{employee.nationality}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Banking Details
                    </h4>
                    <div className="space-y-2">
                      {employee.bank_name && (
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{employee.bank_name}</span>
                        </div>
                      )}
                      {employee.iban && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">IBAN:</span>
                          <span className="text-xs font-mono">{employee.iban.slice(0, 15)}...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Actions
                    </h4>
                    <div className="space-y-2">
                      <Link href={`/backyard/payroll/salary-structures?employee=${employee.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Salary Structure
                        </Button>
                      </Link>
                      <Link href={`/backyard/payroll/expenses?employee=${employee.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Expenses
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No employees found</h3>
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