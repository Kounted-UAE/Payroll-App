
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  History,
  Lock,
  Calendar,
  Building,
  Users
} from "lucide-react"
import Link from "next/link"

const PayrollSalaryStructures = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const salaryStructures = [
    {
      id: 1,
      employee_name: "Ahmed Al-Mansouri",
      employee_id: 1,
      employer: "Emirates Technology LLC",
      job_title: "Senior Software Engineer",
      base_salary: 15000,
      housing_allowance: 5000,
      transport_allowance: 1000,
      mobile_allowance: 500,
      food_allowance: 800,
      total_allowances: 7300,
      gross_salary: 22300,
      effective_from: "2024-01-01",
      effective_to: null,
      status: "Active",
      eosb_accrual: "UAE Labor Law",
      currency: "AED"
    },
    {
      id: 2,
      employee_name: "Sarah Johnson",
      employee_id: 2,
      employer: "Emirates Technology LLC",
      job_title: "Marketing Manager",
      base_salary: 12000,
      housing_allowance: 4000,
      transport_allowance: 800,
      mobile_allowance: 400,
      food_allowance: 600,
      total_allowances: 5800,
      gross_salary: 17800,
      effective_from: "2024-01-01",
      effective_to: null,
      status: "Active",
      eosb_accrual: "UAE Labor Law",
      currency: "AED"
    },
    {
      id: 3,
      employee_name: "Mohammed Hassan",
      employee_id: 3,
      employer: "Al Noor Industries PJSC",
      job_title: "Finance Director",
      base_salary: 18000,
      housing_allowance: 6000,
      transport_allowance: 1200,
      mobile_allowance: 600,
      food_allowance: 1000,
      total_allowances: 8800,
      gross_salary: 26800,
      effective_from: "2024-01-01",
      effective_to: null,
      status: "Active",
      eosb_accrual: "UAE Labor Law",
      currency: "AED"
    }
  ]

  const filteredStructures = salaryStructures.filter(structure =>
    structure.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    structure.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    structure.employer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "default"
      case "Expired": return "destructive"
      case "Pending": return "secondary"
      default: return "secondary"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Salary Structures</h1>
          <p className="text-muted-foreground">
            Manage employee salary components and allowances
          </p>
        </div>
        <Link href="/payroll/salary-structures/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Salary Structure
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
                placeholder="Search by employee, job title, or employer..."
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

      {/* Salary Structure Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{salaryStructures.filter(s => s.status === "Active").length}</p>
                <p className="text-sm text-muted-foreground">Active Structures</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">AED {salaryStructures.reduce((sum, s) => sum + s.gross_salary, 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{new Set(salaryStructures.map(s => s.employer)).size}</p>
                <p className="text-sm text-muted-foreground">Employers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">AED {Math.round(salaryStructures.reduce((sum, s) => sum + s.gross_salary, 0) / 21).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Avg. EOSB/Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Structures List */}
      <div className="grid gap-6">
        {filteredStructures.map((structure) => (
          <Card key={structure.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{structure.employee_name}</CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-1">
                    <span>{structure.job_title}</span>
                    <span>•</span>
                    <span>{structure.employer}</span>
                    <span>•</span>
                    <span>Effective: {structure.effective_from}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(structure.status)}>
                    {structure.status}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <History className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Base Compensation
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Base Salary:</span>
                      <span className="text-lg font-bold text-blue-600">AED {structure.base_salary.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Currency:</span>
                      <Badge variant="outline">{structure.currency}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Allowances
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Housing:</span>
                      <span className="text-sm font-medium">AED {structure.housing_allowance.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Transport:</span>
                      <span className="text-sm font-medium">AED {structure.transport_allowance.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Mobile:</span>
                      <span className="text-sm font-medium">AED {structure.mobile_allowance.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Food:</span>
                      <span className="text-sm font-medium">AED {structure.food_allowance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Summary
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Allowances:</span>
                      <span className="text-sm font-medium text-green-600">AED {structure.total_allowances.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Gross Salary:</span>
                      <span className="text-lg font-bold text-green-600">AED {structure.gross_salary.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">EOSB Policy:</span>
                      <span className="text-xs font-medium">{structure.eosb_accrual}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Actions
                  </h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit Structure
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <History className="mr-2 h-3 w-3" />
                      View History
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Lock className="mr-2 h-3 w-3" />
                      Lock for Payrun
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStructures.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No salary structures found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first salary structure"}
            </p>
            <Link href="/payroll/salary-structures/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create First Structure
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PayrollSalaryStructures
