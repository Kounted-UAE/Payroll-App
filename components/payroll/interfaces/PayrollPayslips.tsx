'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/react-ui/card"
import { Button } from "@/components/react-ui/button"
import { Input } from "@/components/react-ui/input"
import { Badge } from "@/components/react-ui/badge"
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
  Send,
  LayoutGrid,
  List as ListIcon
} from "lucide-react"
import Link from "next/link"
import { ViewToggle } from "@/components/react-ui/ViewToggle"
import { BulkImportExportDialog } from "@/components/admin/BulkImportExportDialog"
import { z } from "zod"
import { payslipCsvSchema, PAYSLIP_CSV_TEMPLATE, PAYSLIP_EXAMPLE_ROW } from "@/lib/validators/payslipCsvSchema"

const PayrollPayslips = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [dialogOpen, setDialogOpen] = useState(false)

  type Payslip = z.infer<typeof payslipCsvSchema> & {
    // The following fields are for UI/demo only
    id?: string;
    email_status?: string;
  };
  const payslips: Payslip[] = [/* static mock data as before */]

  const filteredPayslips: Payslip[] = payslips.filter(p =>
    p.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.pay_period.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-lg text-zinc-600 font-bold">Payslips</h1>
          <p className="text-blue-400">Generate and distribute employee payslips</p>
        </div>
        <div className="flex items-center space-x-2">
          <ViewToggle view={view} setView={setView} />
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Bulk Import/Export
          </Button>
          <Link href="/advontier/payroll/payslips/generate">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate Payslips
            </Button>
          </Link>
        </div>
      </div>

      <BulkImportExportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        objectName="Payslip"
        tableName="payroll_payslip_records"
        schema={payslipCsvSchema}
        templateHeaders={PAYSLIP_CSV_TEMPLATE}
        exampleRow={PAYSLIP_EXAMPLE_ROW}
      />

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-200" />
              <Input
                placeholder="Search by employee, employer, or pay period..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">Filter by Status</Button>
            <Button variant="outline">Filter by Period</Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid/List View */}
      {view === 'grid' ? (
        <div className="grid gap-6">
          {filteredPayslips.map(p => {
            const StatusIcon = getStatusIcon(p.status)
            return (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <StatusIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xs">{p.employee_name}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-1">
                          <span>{p.employer}</span>
                          <span>•</span>
                          <span>Period: {p.pay_period}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(p.status)}>{p.status}</Badge>
                      <Badge variant={getEmailStatusColor(p.email_status ?? 'Not Sent')}>{p.email_status ?? 'Not Sent'}</Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                        {p.status === "Generated" && (
                          <Button variant="ghost" size="sm"><Mail className="h-4 w-4" /></Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {/* CardContent remains unchanged */}
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-6">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Employee</th>
                  <th>Employer</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Email</th>
                  <th>Gross</th>
                  <th>Net</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayslips.map(p => (
                  <tr key={p.id} className="border-t">
                    <td>{p.employee_name}</td>
                    <td>{p.employer}</td>
                    <td>{p.pay_period}</td>
                    <td><Badge variant={getStatusColor(p.status)}>{p.status}</Badge></td>
                    <td><Badge variant={getEmailStatusColor(p.email_status ?? 'Not Sent')}>{p.email_status ?? 'Not Sent'}</Badge></td>
                    <td>AED {p.gross_salary.toLocaleString()}</td>
                    <td>AED {p.net_salary.toLocaleString()}</td>
                    <td className="flex space-x-1">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                      {p.status === "Generated" && (
                        <Button variant="ghost" size="sm"><Mail className="h-4 w-4" /></Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {filteredPayslips.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-blue-200 mx-auto mb-4" />
            <h3 className="text-xs font-semibold mb-2">No payslips found</h3>
            <p className="text-blue-200 mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Generate payslips from completed payruns"}
            </p>
            <Link href="/advontier/payroll/payslips/generate">
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
