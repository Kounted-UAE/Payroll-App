import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Search, 
  Plus, 
  Eye, 
  Lock, 
  Download,
  Building,
  Users,
  DollarSign,
  FileText,
  Play,
  CheckCircle
} from "lucide-react"
import Link from "next/link"

const PayrollPayruns = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const payruns = [
    {
      id: 1,
      employer: "Emirates Technology LLC",
      employer_id: 1,
      pay_period_start: "2024-01-01",
      pay_period_end: "2024-01-31",
      employee_count: 85,
      gross_total: 1275000,
      net_total: 1147500,
      eosb_total: 63750,
      status: "Completed",
      created_date: "2024-02-01",
      locked_date: "2024-02-05",
      wps_exported: true
    },
    {
      id: 2,
      employer: "Al Noor Industries PJSC",
      employer_id: 2,
      pay_period_start: "2024-01-01",
      pay_period_end: "2024-01-31",
      employee_count: 156,
      gross_total: 2340000,
      net_total: 2106000,
      eosb_total: 117000,
      status: "Locked",
      created_date: "2024-02-01",
      locked_date: "2024-02-03",
      wps_exported: false
    },
    {
      id: 3,
      employer: "Gulf Trading Company LLC",
      employer_id: 3,
      pay_period_start: "2024-01-01",
      pay_period_end: "2024-01-31",
      employee_count: 42,
      gross_total: 378000,
      net_total: 340200,
      eosb_total: 18900,
      status: "Draft",
      created_date: "2024-02-01",
      locked_date: null,
      wps_exported: false
    },
    {
      id: 4,
      employer: "Emirates Technology LLC",
      employer_id: 1,
      pay_period_start: "2024-02-01",
      pay_period_end: "2024-02-29",
      employee_count: 85,
      gross_total: 1275000,
      net_total: 1147500,
      eosb_total: 63750,
      status: "Processing",
      created_date: "2024-03-01",
      locked_date: null,
      wps_exported: false
    }
  ]

  const filteredPayruns = payruns.filter(payrun =>
    payrun.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payrun.status.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "default"
      case "Locked": return "secondary"
      case "Processing": return "destructive"
      case "Draft": return "outline"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed": return CheckCircle
      case "Locked": return Lock
      case "Processing": return Play
      case "Draft": return FileText
      default: return FileText
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payruns</h1>
          <p className="text-muted-foreground">
            Process and manage monthly payroll calculations
          </p>
        </div>
        <Link href="/payroll/payruns/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Payrun
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
                placeholder="Search by employer or status..."
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

      {/* Payrun Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{payruns.filter(p => p.status === "Draft").length}</p>
                <p className="text-sm text-muted-foreground">Draft Payruns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{payruns.filter(p => p.status === "Processing").length}</p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{payruns.filter(p => p.status === "Locked").length}</p>
                <p className="text-sm text-muted-foreground">Locked</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{payruns.filter(p => p.status === "Completed").length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payruns List */}
      <div className="grid gap-6">
        {filteredPayruns.map((payrun) => {
          const StatusIcon = getStatusIcon(payrun.status)
          return (
            <Card key={payrun.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <StatusIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{payrun.employer}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span>Period: {payrun.pay_period_start} to {payrun.pay_period_end}</span>
                        <span>•</span>
                        <span>Created: {payrun.created_date}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(payrun.status)}>
                      {payrun.status}
                    </Badge>
                    {payrun.wps_exported && (
                      <Badge variant="outline" className="text-green-600">
                        WPS Exported
                      </Badge>
                    )}
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payrun.status === "Draft" && (
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {payrun.status === "Locked" && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
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
                      Employee Count
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-2xl font-bold">{payrun.employee_count}</span>
                      <span className="text-sm text-muted-foreground">employees</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Gross Total
                    </h4>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">
                        AED {payrun.gross_total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Net Total
                    </h4>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="text-2xl font-bold text-blue-600">
                        AED {payrun.net_total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      EOSB Accrual
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <span className="text-2xl font-bold text-purple-600">
                        AED {payrun.eosb_total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {payrun.locked_date && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        <span>Locked on {payrun.locked_date}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {payrun.status === "Draft" && (
                      <>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button size="sm">
                          <Play className="mr-2 h-4 w-4" />
                          Process
                        </Button>
                      </>
                    )}
                    {payrun.status === "Processing" && (
                      <Button variant="outline" size="sm">
                        <Lock className="mr-2 h-4 w-4" />
                        Lock & Finalize
                      </Button>
                    )}
                    {payrun.status === "Locked" && !payrun.wps_exported && (
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export WPS
                      </Button>
                    )}
                    {payrun.status === "Completed" && payrun.id ? (
                      <Link href={`/payroll/payslips?payrun=${payrun.id}`}>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Payslips
                        </Button>
                      </Link>
                    ) : payrun.status === "Completed" ? (
                      <Button variant="outline" size="sm" disabled>
                        <FileText className="mr-2 h-4 w-4" />
                        View Payslips
                      </Button>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredPayruns.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payruns found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first payrun"}
            </p>
            <Link href="/payroll/payruns/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create First Payrun
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PayrollPayruns