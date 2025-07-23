import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Building, 
  DollarSign, 
  FileText, 
  Receipt, 
  BarChart3,
  Plus,
  Calendar,
  TrendingUp
} from "lucide-react"
import { Link } from "react-router-dom"

const PayrollDashboard = () => {
  const stats = [
    {
      title: "Total Employers",
      value: "12",
      description: "Active clients",
      icon: Building,
      trend: "+2 this month"
    },
    {
      title: "Total Employees",
      value: "456",
      description: "Across all employers",
      icon: Users,
      trend: "+23 this month"
    },
    {
      title: "Monthly Payroll",
      value: "AED 2.4M",
      description: "Current month total",
      icon: DollarSign,
      trend: "+8.2% vs last month"
    },
    {
      title: "Pending Payruns",
      value: "3",
      description: "Awaiting processing",
      icon: Calendar,
      trend: "Due this week"
    }
  ]

  const quickActions = [
    {
      title: "Add New Employer",
      description: "Onboard a new client company",
      icon: Building,
      href: "/payroll/employers/new",
      color: "bg-blue-500"
    },
    {
      title: "Add Employee",
      description: "Register new employee",
      icon: Users,
      href: "/payroll/employees/new",
      color: "bg-green-500"
    },
    {
      title: "Create Payrun",
      description: "Process monthly payroll",
      icon: FileText,
      href: "/payroll/payruns/new",
      color: "bg-purple-500"
    },
    {
      title: "Review Claims",
      description: "Approve expense claims",
      icon: Receipt,
      href: "/payroll/expenses",
      color: "bg-orange-500"
    }
  ]

  const recentActivity = [
    {
      action: "Payrun completed",
      company: "Emirates Tech LLC",
      time: "2 hours ago",
      amount: "AED 145,000"
    },
    {
      action: "New employee added",
      company: "Dubai Trading Co",
      time: "4 hours ago",
      employee: "Ahmed Al-Mansouri"
    },
    {
      action: "Expense claim approved",
      company: "Gulf Consulting",
      time: "6 hours ago",
      amount: "AED 2,500"
    },
    {
      action: "Salary structure updated",
      company: "Al Noor Industries",
      time: "1 day ago",
      details: "Housing allowance adjusted"
    }
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">UAE Payroll Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive payroll management for UAE businesses
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/payroll/reports">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link to="/payroll/payruns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Payrun
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common payroll tasks and workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {quickActions.map((action) => (
                  <Link key={action.title} to={action.href}>
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-md ${action.color}`}>
                            <action.icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest payroll activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.company}</p>
                  {activity.amount && (
                    <p className="text-sm font-semibold text-green-600">{activity.amount}</p>
                  )}
                  {activity.employee && (
                    <p className="text-sm text-blue-600">{activity.employee}</p>
                  )}
                  {activity.details && (
                    <p className="text-sm text-orange-600">{activity.details}</p>
                  )}
                  {index < recentActivity.length - 1 && <div className="border-b" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PayrollDashboard