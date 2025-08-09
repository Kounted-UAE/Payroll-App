
'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ViewToggle } from "@/components/ui/ViewToggle"
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Eye, 
  Calendar,
  DollarSign,
  Building,
  Users,
  FileSpreadsheet,
  PieChart,
  LineChart
} from "lucide-react"

const PayrollReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-01")
  const [view, setView] = useState<'list' | 'grid'>('list')

  const reports = [
    {
      id: 1,
      title: "Monthly Payroll Summary",
      description: "Complete payroll breakdown by employer and employee",
      period: "January 2024",
      type: "Summary",
      total_cost: 892500,
      employee_count: 283,
      employer_count: 15,
      generated_date: "2024-02-05",
      status: "Ready"
    },
    {
      id: 2,
      title: "EOSB Liability Report",
      description: "End of Service Benefits liability by employer",
      period: "January 2024",
      type: "EOSB",
      total_liability: 4762300,
      employee_count: 283,
      employer_count: 15,
      generated_date: "2024-02-05",
      status: "Ready"
    },
    {
      id: 3,
      title: "Employer Cost Analysis",
      description: "Detailed cost breakdown and trends by employer",
      period: "January 2024",
      type: "Cost Analysis",
      total_cost: 892500,
      cost_increase: 5.2,
      employer_count: 15,
      generated_date: "2024-02-05",
      status: "Ready"
    },
    {
      id: 4,
      title: "WPS Export Summary",
      description: "Summary of WPS file exports and bank transfers",
      period: "January 2024",
      type: "WPS",
      total_transfers: 748200,
      transfer_count: 12,
      employer_count: 12,
      generated_date: "2024-02-06",
      status: "Ready"
    },
    {
      id: 5,
      title: "Employee Demographics",
      description: "Workforce analysis by nationality, age, and tenure",
      period: "January 2024",
      type: "Demographics",
      employee_count: 283,
      nationality_count: 24,
      avg_tenure_months: 18,
      generated_date: "2024-02-05",
      status: "Ready"
    },
    {
      id: 6,
      title: "Compliance Report",
      description: "Visa status, contract renewals, and regulatory compliance",
      period: "January 2024",
      type: "Compliance",
      compliance_score: 94.5,
      pending_renewals: 7,
      expired_visas: 2,
      generated_date: "2024-02-05",
      status: "Ready"
    }
  ]

  const getReportIcon = (type: string) => {
    switch (type) {
      case "Summary": return BarChart3
      case "EOSB": return Calendar
      case "Cost Analysis": return TrendingUp
      case "WPS": return DollarSign
      case "Demographics": return Users
      case "Compliance": return Building
      default: return FileSpreadsheet
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Summary": return "bg-primary/10 text-primary"
      case "EOSB": return "bg-primary/10 text-primary"
      case "Cost Analysis": return "bg-primary/10 text-primary"
      case "WPS": return "bg-primary/10 text-primary"
      case "Demographics": return "bg-primary/10 text-primary"
      case "Compliance": return "bg-primary/10 text-primary"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-lg text-zinc-600 font-bold">Payroll Reports</h1>
          <p className="text-blue-400">
            Generate and download comprehensive payroll analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <ViewToggle view={view} setView={setView} />
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export All Reports
          </Button>
        </div>
      </div>

      {/* Period Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Reporting Period:</span>
            </div>
            <Input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-48"
            />
            <Button variant="outline">Generate Reports</Button>
            <Button variant="outline">Schedule Reports</Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-bold">AED 892.5K</p>
                <p className="text-xs text-muted-foreground">Total Payroll Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-bold">283</p>
                <p className="text-xs text-muted-foreground">Active Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs font-bold">AED 4.76M</p>
                <p className="text-xs text-muted-foreground">EOSB Liability</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-xs font-bold">15</p>
                <p className="text-xs text-muted-foreground">Employers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Display */}
      {view === 'grid' ? (
        <div className="grid gap-6 md:grid-cols-2">
          {reports.map((report) => {
            const ReportIcon = getReportIcon(report.type)
            return (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${getTypeColor(report.type)}`}>
                        <ReportIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xs">{report.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {report.description}
                        </CardDescription>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{report.type}</Badge>
                          <Badge variant="outline">{report.period}</Badge>
                          <Badge variant="default">{report.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {report.type === "Summary" && (
                      <>
                        <div>
                          <p className="text-xs font-bold text-primary">AED {((report.total_cost ?? 0) / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-muted-foreground">Total Cost</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">{report.employee_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Employees</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-purple-600">{report.employer_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Employers</p>
                        </div>
                      </>
                    )}
                    
                    {report.type === "EOSB" && (
                      <>
                        <div>
                          <p className="text-xs font-bold text-purple-600">AED {((report.total_liability ?? 0) / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-muted-foreground">Total Liability</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">{report.employee_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Employees</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-orange-600">AED {Math.round((report.total_liability ?? 0) / ((report.employee_count ?? 1) || 1)).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Avg. per Employee</p>
                        </div>
                      </>
                    )}
                    
                    {report.type === "Cost Analysis" && (
                      <>
                        <div>
                          <p className="text-xs font-bold text-primary">AED {((report.total_cost ?? 0) / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-muted-foreground">Total Cost</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">+{report.cost_increase ?? 0}%</p>
                          <p className="text-xs text-muted-foreground">Month Growth</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">{report.employer_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Employers</p>
                        </div>
                      </>
                    )}
                    
                    {report.type === "WPS" && (
                      <>
                        <div>
                          <p className="text-xs font-bold text-orange-600">AED {((report.total_transfers ?? 0) / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-muted-foreground">Transfers</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">{report.transfer_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">WPS Files</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-purple-600">{report.employer_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Employers</p>
                        </div>
                      </>
                    )}
                    
                    {report.type === "Demographics" && (
                      <>
                        <div>
                          <p className="text-xs font-bold text-pink-600">{report.employee_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Employees</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">{report.nationality_count ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Nationalities</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">{report.avg_tenure_months ?? 0}m</p>
                          <p className="text-xs text-muted-foreground">Avg. Tenure</p>
                        </div>
                      </>
                    )}
                    
                    {report.type === "Compliance" && (
                      <>
                        <div>
                          <p className="text-xs font-bold text-primary">{report.compliance_score ?? 0}%</p>
                          <p className="text-xs text-muted-foreground">Compliance</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-orange-600">{report.pending_renewals}</p>
                          <p className="text-xs text-muted-foreground">Pending</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-red-600">{report.expired_visas}</p>
                          <p className="text-xs text-muted-foreground">Expired</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Generated: {report.generated_date}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm">
                        <Download className="mr-2 h-3 w-3" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => {
            const ReportIcon = getReportIcon(report.type)
            return (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${getTypeColor(report.type)}`}>
                        <ReportIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{report.type}</Badge>
                          <Badge variant="outline">{report.period}</Badge>
                          <Badge variant="default">{report.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {report.type === "Summary" && `AED ${((report.total_cost ?? 0) / 1000).toFixed(0)}K`}
                          {report.type === "EOSB" && `AED ${((report.total_liability ?? 0) / 1000000).toFixed(1)}M`}
                          {report.type === "Cost Analysis" && `AED ${((report.total_cost ?? 0) / 1000).toFixed(0)}K`}
                          {report.type === "WPS" && `AED ${((report.total_transfers ?? 0) / 1000).toFixed(0)}K`}
                          {report.type === "Demographics" && `${report.employee_count ?? 0} employees`}
                          {report.type === "Compliance" && `${report.compliance_score ?? 0}% compliance`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Generated: {report.generated_date}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-3 w-3" />
                          View
                        </Button>
                        <Button size="sm">
                          <Download className="mr-2 h-3 w-3" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Actions</CardTitle>
          <CardDescription>Generate custom reports and exports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <FileSpreadsheet className="h-6 w-6" />
              <span>Export to Excel</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <PieChart className="h-6 w-6" />
              <span>Custom Dashboard</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center space-y-2">
              <LineChart className="h-6 w-6" />
              <span>Trend Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PayrollReports
