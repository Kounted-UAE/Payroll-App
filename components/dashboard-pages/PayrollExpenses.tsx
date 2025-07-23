
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Receipt, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  CheckCircle,
  XCircle,
  Clock,
  Upload,
  DollarSign,
  Building,
  Users
} from "lucide-react"
import Link from "next/link"

const PayrollExpenses = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const expenses = [
    {
      id: 1,
      employee_name: "Ahmed Al-Mansouri",
      employee_id: 1,
      employer: "Emirates Technology LLC",
      description: "Client meeting lunch expenses",
      amount: 150,
      category: "Meals & Entertainment",
      expense_date: "2024-01-15",
      submitted_date: "2024-01-16",
      status: "Approved",
      approved_by: "Sarah Johnson",
      approved_date: "2024-01-18",
      has_receipt: true,
      is_billable: true,
      payrun_linked: true,
      payrun_id: 1
    },
    {
      id: 2,
      employee_name: "Sarah Johnson",
      employee_id: 2,
      employer: "Emirates Technology LLC",
      description: "Taxi fare for site visit",
      amount: 75,
      category: "Transportation",
      expense_date: "2024-01-20",
      submitted_date: "2024-01-21",
      status: "Pending",
      approved_by: null,
      approved_date: null,
      has_receipt: true,
      is_billable: true,
      payrun_linked: false,
      payrun_id: null
    },
    {
      id: 3,
      employee_name: "Mohammed Hassan",
      employee_id: 3,
      employer: "Al Noor Industries PJSC",
      description: "Office supplies purchase",
      amount: 250,
      category: "Office Supplies",
      expense_date: "2024-01-22",
      submitted_date: "2024-01-23",
      status: "Rejected",
      approved_by: "Finance Manager",
      approved_date: "2024-01-24",
      rejection_reason: "Missing required documentation",
      has_receipt: false,
      is_billable: false,
      payrun_linked: false,
      payrun_id: null
    },
    {
      id: 4,
      employee_name: "Priya Sharma",
      employee_id: 4,
      employer: "Gulf Trading Company LLC",
      description: "Conference registration fee",
      amount: 500,
      category: "Training & Development",
      expense_date: "2024-01-25",
      submitted_date: "2024-01-26",
      status: "Approved",
      approved_by: "HR Manager",
      approved_date: "2024-01-27",
      has_receipt: true,
      is_billable: false,
      payrun_linked: false,
      payrun_id: null
    }
  ]

  const filteredExpenses = expenses.filter(expense =>
    expense.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.employer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "default"
      case "Pending": return "secondary"
      case "Rejected": return "destructive"
      default: return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved": return CheckCircle
      case "Pending": return Clock
      case "Rejected": return XCircle
      default: return Clock
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Claims</h1>
          <p className="text-muted-foreground">
            Manage and approve employee expense reimbursements
          </p>
        </div>
        <Link href="/payroll/expenses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Submit Expense
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
                placeholder="Search by employee, description, category, or employer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              Filter by Status
            </Button>
            <Button variant="outline">
              Filter by Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expense Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{expenses.filter(e => e.status === "Pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{expenses.filter(e => e.status === "Approved").length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">AED {expenses.filter(e => e.status === "Approved").reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Approved Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{expenses.filter(e => e.has_receipt).length}</p>
                <p className="text-sm text-muted-foreground">With Receipts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expenses List */}
      <div className="grid gap-6">
        {filteredExpenses.map((expense) => {
          const StatusIcon = getStatusIcon(expense.status)
          return (
            <Card key={expense.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <StatusIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{expense.employee_name}</CardTitle>
                      <CardDescription className="flex items-center space-x-4 mt-1">
                        <span>{expense.employer}</span>
                        <span>•</span>
                        <span>{expense.category}</span>
                        <span>•</span>
                        <span>Submitted: {expense.submitted_date}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusColor(expense.status)}>
                      {expense.status}
                    </Badge>
                    {expense.is_billable && (
                      <Badge variant="outline" className="text-green-600">
                        Billable
                      </Badge>
                    )}
                    {expense.has_receipt && (
                      <Badge variant="outline" className="text-blue-600">
                        Receipt
                      </Badge>
                    )}
                    {expense.payrun_linked && (
                      <Badge variant="outline" className="text-purple-600">
                        In Payrun #{expense.payrun_id}
                      </Badge>
                    )}
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {expense.status === "Pending" && (
                        <>
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {expense.has_receipt && (
                        <Button variant="ghost" size="sm">
                          <Upload className="h-4 w-4" />
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
                      Expense Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="text-lg font-bold text-green-600">AED {expense.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">{expense.expense_date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Category:</span>
                        <Badge variant="outline" className="text-xs">{expense.category}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Description
                    </h4>
                    <p className="text-sm">{expense.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {expense.has_receipt && (
                        <Badge variant="outline" className="text-blue-600">
                          <Receipt className="mr-1 h-3 w-3" />
                          Receipt Available
                        </Badge>
                      )}
                      {expense.is_billable && (
                        <Badge variant="outline" className="text-green-600">
                          Billable
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Approval Status
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge variant={getStatusColor(expense.status)}>
                          {expense.status}
                        </Badge>
                      </div>
                      {expense.approved_by && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">By:</span>
                          <span className="text-sm font-medium">{expense.approved_by}</span>
                        </div>
                      )}
                      {expense.approved_date && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Date:</span>
                          <span className="text-sm font-medium">{expense.approved_date}</span>
                        </div>
                      )}
                      {expense.status === "Rejected" && expense.rejection_reason && (
                        <div className="mt-2">
                          <span className="text-xs text-destructive">Reason: {expense.rejection_reason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Actions
                    </h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="mr-2 h-3 w-3" />
                        View Details
                      </Button>
                      {expense.status === "Pending" && (
                        <>
                          <Button size="sm" className="w-full">
                            <CheckCircle className="mr-2 h-3 w-3" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm" className="w-full">
                            <XCircle className="mr-2 h-3 w-3" />
                            Reject
                          </Button>
                        </>
                      )}
                      {expense.status === "Approved" && !expense.payrun_linked && (
                        <Button variant="outline" size="sm" className="w-full">
                          Link to Payrun
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

      {filteredExpenses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No expense claims found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search criteria" : "Get started by submitting your first expense claim"}
            </p>
            <Link href="/payroll/expenses/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Submit First Expense
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PayrollExpenses
