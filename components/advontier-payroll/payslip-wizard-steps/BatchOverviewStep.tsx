// componentsadvontier-payrollsteps/BatchOverviewStep.tsx

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building, Calendar, Users, DollarSign, FileText } from 'lucide-react'

interface BatchData {
  batch_id: string
  employer_name: string
  pay_period_from: string
  pay_period_to: string
  total_employees: number
  total_salary: number
  currency: string
}

interface BatchOverviewStepProps {
  batchData: BatchData
  employees: any[]
}

export function BatchOverviewStep({ batchData, employees }: BatchOverviewStepProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'AED'
    }).format(amount)
  }

  return (
    <div className="space-y-6 bg-zinc-100">
      <div>
        <h3 className="text-lg font-semibold mb-2">Batch Overview</h3>
        <p className="text-blue-400">
          Review the imported payroll data before generating payslips
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Employer</p>
                <p className="text-lg font-bold">{batchData.employer_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Pay Period</p>
                <p className="text-lg font-bold">
                  {formatDate(batchData.pay_period_from)} - {formatDate(batchData.pay_period_to)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Employees</p>
                <p className="text-lg font-bold">{batchData.total_employees}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Total Salary</p>
                <p className="text-lg font-bold">
                  {formatCurrency(batchData.total_salary, batchData.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Employee Records ({employees.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Total Salary</TableHead>
                  <TableHead>Currency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.slice(0, 10).map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employee_name}</TableCell>
                    <TableCell>{employee.email_id || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(employee.basic_salary || 0, employee.currency)}</TableCell>
                    <TableCell>{formatCurrency(employee.total_salary || 0, employee.currency)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.currency || 'AED'}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {employees.length > 10 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-blue-200">
                      ... and {employees.length - 10} more employees
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Validation Summary */}
      <Card className="border-green-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Data Validation Complete</h4>
              <p className="text-sm text-blue-700 mt-1">
                All {employees.length} employee records have been validated and are ready for payslip generation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 