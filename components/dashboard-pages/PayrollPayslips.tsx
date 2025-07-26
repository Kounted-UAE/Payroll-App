
'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Search, 
  Plus, 
  Eye, 
  Download,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Send
} from "lucide-react"
import Link from "next/link"

const PayrollPayslips = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const payslips = [
    {
      id: 1,
      employee_name: "Ahmed Al-Mansouri",
      employee_id: 1,
      employer: "Emirates Technology LLC",
      payrun_id: 1,
      pay_period: "January 2024",
      pay_period_start: "2024-01-01",
      pay_period_end: "2024-01-31",
      gross_salary: 22300,
      net_salary: 20070,
      status: "Sent",
      sent_date: "2024-02-05",
      email_status: "Delivered",
      language: "English"
    },
    {
      id: 2,
      employee_name: "Sarah Johnson",
      employee_id: 2,
      employer: "Emirates Technology LLC",
      payrun_id: 1,
      pay_period: "January 2024",
      pay_period_start: "2024-01-01",
      pay_period_end: "2024-01-31",
      gross_salary: 17800,
      net_salary: 16020,
      status: "Generated",
      sent_date: null,
      email_status: "Pending",
      language: "English"
    },
    {
      id: 3,
      employee_name: "Mohammed Hassan",
      employee_id: 3,
      employer: "Al Noor Industries PJSC",
      payrun_id: 2,
      pay_period: "January 2024",
      pay_period_start: "2024-01-01",
      pay_period_end: "2024-01-31",
      gross_salary: 26800,
      net_salary: 24120,
      status: "Sent",
      sent_date: "2024-02-03",
      email_status: "Delivered",
      language: "Arabic"
    },
    {
      id: 4,
      employee_name: "Priya Sharma",
      employee_id: 4,
      employer: "Gulf Trading Company LLC",
      payrun_id: 3,
      pay_period: "January 2024",
      pay_period_start: "2024-01-01",
      pay_period_end: "2024-01-31",
      gross_salary: 11600,
      net_salary: 10440,
      status: "Draft",
      sent_date: null,
      email_status: "Not Sent",
      language: "English"
    }
  ]

  const filteredPayslips = payslips.filter(payslip =>
    payslip.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payslip.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payslip.pay_period.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent": return "default"
      case "Generated": return "secondary"
      case "Draft": return "outline"
      case "Failed": return "destructive"
      default: return "secondary"
    }
  }

  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "default"
      case "Pending": return "secondary"
      case "Failed": return "destructive"
      case "Not Sent": return "outline"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Sent": return CheckCircle
      case "Generated": return FileText
      case "Draft": return Clock
      case "Failed": return AlertCircle
      default: return FileText
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payslips</h1>
          <p className="text-muted-foreground">
            Generate and distribute employee payslips
          </p>
        </div>
        <Link href="/payroll/payslips/generate">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate Payslips
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
                placeholder="Search by employee, employer, or pay period..."
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

      {/* Payslip Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{payslips.filter(p => p.status === "Sent").length}</p>
                <p className="text-sm text-muted-foreground">Sent Payslips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{payslips.filter(p => p.status === "Generated").length}</p>
                <p className="text-sm text-muted-foreground">Ready to Send</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{payslips.filter(p => p.status === "Draft").length}</p>
                <p className="text-sm text-muted-foreground">Draft Payslips</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{new Set(payslips.map(p => p.employer)).size}</p>
                <p className="text-sm text-muted-foreground">Employers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payslips List */}
      <div className="grid gap-6">
        {filteredPayslips.map((payslip) => {
          const StatusIcon = getStatusIcon(payslip.status)
          return (
            <Card key={payslip.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <StatusIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{payslip.employee_name}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span>{payslip.employer}</span>
                        <span>•</span>
                        <span>Period: {payslip.pay_period}</span>
                        <span>•</span>
                        <span>Language: {payslip.language}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(payslip.status)}>
                      {payslip.status}
                    </Badge>
                    <Badge variant={getEmailStatusColor(payslip.email_status)}>
                      {payslip.email_status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {payslip.status === "Generated" && (
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Pay Period
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Start:</span>
                        <span className="text-sm font-medium">{payslip.pay_period_start}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">End:</span>
                        <span className="text-sm font-medium">{payslip.pay_period_end}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Payrun:</span>
                        <Badge variant="outline">#{payslip.payrun_id}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Salary Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Gross:</span>
                        <span className="text-sm font-bold text-green-600">AED {payslip.gross_salary.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Net:</span>
                        <span className="text-lg font-bold text-blue-600">AED {payslip.net_salary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Delivery Status
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Email Status:</span>
                        <Badge variant={getEmailStatusColor(payslip.email_status)} className="text-xs">
                          {payslip.email_status}
                        </Badge>
                      </div>
                      {payslip.sent_date && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Sent Date:</span>
                          <span className="text-sm font-medium">{payslip.sent_date}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Language:</span>
                        <span className="text-sm font-medium">{payslip.language}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Actions
                    </h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-3 w-3" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="mr-2 h-3 w-3" />
                        Download PDF
                      </Button>
                      {payslip.status === "Generated" && (
                        <Button size="sm" className="w-full">
                          <Send className="mr-2 h-3 w-3" />
                          Send Email
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPayslips.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payslips found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Generate payslips from completed payruns"}
            </p>
            <Link href="/payroll/payslips/generate">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Generate Payslips
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PayrollPayslips
