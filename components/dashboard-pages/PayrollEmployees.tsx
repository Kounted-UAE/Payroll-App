'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  FileText
} from "lucide-react"
import Link from "next/link"

const PayrollEmployees = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const employees = [
    {
      id: 1,
      full_name: "Ahmed Al-Mansouri",
      emirates_id: "784-1990-1234567-8",
      passport_number: "A1234567",
      nationality: "UAE",
      job_title: "Senior Software Engineer",
      employer: "Emirates Technology LLC",
      employer_id: 1,
      start_date: "2023-01-15",
      contract_type: "Unlimited",
      base_salary: 15000,
      status: "Active",
      visa_status: "Valid",
      bank_name: "Emirates NBD",
      iban: "AE07 0331 2345 6789 0123 456"
    },
    {
      id: 2,
      full_name: "Sarah Johnson",
      emirates_id: "784-1985-9876543-2",
      passport_number: "B9876543",
      nationality: "British",
      job_title: "Marketing Manager",
      employer: "Emirates Technology LLC",
      employer_id: 1,
      start_date: "2022-08-10",
      contract_type: "Limited (2 years)",
      base_salary: 12000,
      status: "Active",
      visa_status: "Valid",
      bank_name: "ADCB",
      iban: "AE04 0030 0012 3456 7890 123"
    },
    {
      id: 3,
      full_name: "Mohammed Hassan",
      emirates_id: "784-1988-5555777-9",
      passport_number: "C5555777",
      nationality: "Egyptian",
      job_title: "Finance Director",
      employer: "Al Noor Industries PJSC",
      employer_id: 2,
      start_date: "2021-03-01",
      contract_type: "Unlimited",
      base_salary: 18000,
      status: "Active",
      visa_status: "Valid",
      bank_name: "FAB",
      iban: "AE03 0350 0098 7654 3210 987"
    },
    {
      id: 4,
      full_name: "Priya Sharma",
      emirates_id: "784-1992-1111333-5",
      passport_number: "D1111333",
      nationality: "Indian",
      job_title: "HR Specialist",
      employer: "Gulf Trading Company LLC",
      employer_id: 3,
      start_date: "2023-06-01",
      contract_type: "Limited (3 years)",
      base_salary: 8000,
      status: "On Leave",
      visa_status: "Valid",
      bank_name: "RAKBANK",
      iban: "AE11 0400 0123 4567 8901 234"
    }
  ]

  const filteredEmployees = employees.filter(employee =>
    employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.emirates_id.includes(searchQuery) ||
    employee.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.employer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default"
      case "On Leave": return "secondary"
      case "Terminated": return "destructive"
      default: return "secondary"
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
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
        <Link href="/payroll/employees/new">
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
                <p className="text-2xl font-bold">{employees.filter(e => e.status === "Active").length}</p>
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
                <p className="text-2xl font-bold">{employees.filter(e => e.status === "On Leave").length}</p>
                <p className="text-sm text-muted-foreground">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{new Set(employees.map(e => e.employer_id)).size}</p>
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
                <p className="text-2xl font-bold">{employees.filter(e => e.contract_type === "Unlimited").length}</p>
                <p className="text-sm text-muted-foreground">Unlimited Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees List */}
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
                      <span>{employee.job_title}</span>
                      <span>•</span>
                      <span>{employee.employer}</span>
                      <span>•</span>
                      <span>EID: {employee.emirates_id}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>
                  <Badge variant="outline">
                    {employee.nationality}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Contract:</span>
                      <span className="text-sm font-medium">{employee.contract_type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Visa Status:</span>
                      <Badge variant="outline" className="text-xs">
                        {employee.visa_status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Identification
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Emirates ID:</span>
                      <span className="text-sm font-medium">{employee.emirates_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Passport:</span>
                      <span className="text-sm font-medium">{employee.passport_number}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Nationality:</span>
                      <span className="text-sm font-medium">{employee.nationality}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Banking Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{employee.bank_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">IBAN:</span>
                      <span className="text-xs font-mono">{employee.iban.slice(0, 15)}...</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Salary & Actions
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Base Salary:</span>
                      <span className="text-lg font-bold text-green-600">AED {employee.base_salary.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 space-y-2">
                      {employee.id ? (
                        <Link href={`/dashboard/payroll/salary-structures?employee=${employee.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Salary Structure
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full" disabled>
                          View Salary Structure
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No employees found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first employee"}
            </p>
            <Link href="/payroll/employees/new">
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