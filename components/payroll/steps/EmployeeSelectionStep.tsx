'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Search, CheckSquare, Square, DollarSign } from 'lucide-react'
import { useState } from 'react'

interface EmployeeData {
  id: string
  employee_name: string
  email_id?: string
  employee_mol?: string
  basic_salary?: number
  total_salary?: number
  total_to_transfer?: number
  currency?: string
}

interface EmployeeSelectionStepProps {
  employees: EmployeeData[]
  selectedEmployees: string[]
  onSelectionChange: (selected: string[]) => void
}

export function EmployeeSelectionStep({ 
  employees, 
  selectedEmployees, 
  onSelectionChange 
}: EmployeeSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showOnlyWithEmail, setShowOnlyWithEmail] = useState(false)

  // Filter employees based on search term and email filter
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_mol?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const hasEmail = showOnlyWithEmail ? !!employee.email_id : true
    
    return matchesSearch && hasEmail
  })

  const handleSelectAll = () => {
    onSelectionChange(filteredEmployees.map(emp => emp.id))
  }

  const handleClearAll = () => {
    onSelectionChange([])
  }

  const handleEmployeeToggle = (employeeId: string) => {
    const newSelection = selectedEmployees.includes(employeeId)
      ? selectedEmployees.filter(id => id !== employeeId)
      : [...selectedEmployees, employeeId]
    onSelectionChange(newSelection)
  }

  const formatCurrency = (amount: number | undefined, currency: string) => {
    if (!amount) return '0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'AED',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const totalSelectedSalary = employees
    .filter(emp => selectedEmployees.includes(emp.id))
    .reduce((sum, emp) => sum + (emp.total_to_transfer || emp.total_salary || 0), 0)

  const employeesWithEmail = employees.filter(emp => emp.email_id).length
  const selectedWithEmail = selectedEmployees.filter(id => 
    employees.find(emp => emp.id === id)?.email_id
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Employees</h3>
        <p className="text-muted-foreground">
          Choose which employees to generate payslips for
        </p>
      </div>

      {/* Selection Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center space-x-2"
              >
                <CheckSquare className="h-4 w-4" />
                <span>Select All ({filteredEmployees.length})</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="flex items-center space-x-2"
              >
                <Square className="h-4 w-4" />
                <span>Clear All</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {selectedEmployees.length} of {employees.length} selected
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees by name, email, or MOL ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="email-filter"
                checked={showOnlyWithEmail}
                onCheckedChange={(checked) => setShowOnlyWithEmail(checked as boolean)}
              />
              <label htmlFor="email-filter" className="text-sm text-muted-foreground">
                Show only employees with email
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Warning */}
      {selectedEmployees.length > 0 && selectedWithEmail < selectedEmployees.length && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-yellow-900">Email Delivery Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  {selectedEmployees.length - selectedWithEmail} selected employees don't have email addresses. 
                  They will only receive payslips via download if email delivery is selected.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Employee List</span>
            {selectedEmployees.length > 0 && (
              <Badge variant="default">
                {selectedEmployees.length} selected
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredEmployees.length > 0 && 
                               filteredEmployees.every(emp => selectedEmployees.includes(emp.id))}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleSelectAll()
                        } else {
                          handleClearAll()
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>MOL ID</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead>Currency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={() => handleEmployeeToggle(employee.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{employee.employee_name}</TableCell>
                    <TableCell>
                      {employee.email_id ? (
                        <span className="text-green-600">{employee.email_id}</span>
                      ) : (
                        <span className="text-red-500 text-xs">No email</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {employee.employee_mol || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(employee.basic_salary, employee.currency || 'AED')}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(employee.total_to_transfer || employee.total_salary, employee.currency || 'AED')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.currency || 'AED'}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {searchTerm ? 'No employees found matching your search' : 'No employees available'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {selectedEmployees.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-900">
                  Selection Summary
                </h4>
                <div className="text-sm text-green-700 mt-1 space-y-1">
                  <p>• {selectedEmployees.length} employees selected for payslip generation</p>
                  <p>• {selectedWithEmail} employees have email addresses</p>
                  <p>• {employeesWithEmail} total employees with emails available</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-700">Total Net Salary</p>
                <p className="text-lg font-bold text-green-900">
                  {formatCurrency(totalSelectedSalary, employees[0]?.currency || 'AED')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {employees.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No Employees Found</h3>
            <p className="text-sm text-muted-foreground">
              No employee data is available for this batch. Please check the batch import.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 