'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/react-ui/card"
import { Button } from "@/components/react-ui/button"
import { Skeleton } from "@/components/react-ui/skeleton"
import { usePayrollDashboardStats } from "@/hooks/usePayrollDashboardStats"
import { 
  Users, 
  Building, 
  DollarSign, 
  FileText, 
  Receipt, 
  BarChart3,
  Plus,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

const PayrollDashboard = () => {
  const { stats, loading, error } = usePayrollDashboardStats()

  const statsData = [
    {
      title: "Total Employers",
      value: loading ? <Skeleton className="h-8 w-16" /> : stats.totalEmployers.count.toString(),
      description: "Active clients",
      icon: Building,
      trend: stats.totalEmployers.trend
    },
    {
      title: "Total Employees",
      value: loading ? <Skeleton className="h-8 w-16" /> : stats.totalEmployees.count.toString(),
      description: "Across all employers",
      icon: Users,
      trend: stats.totalEmployees.trend
    },
    {
      title: "Monthly Payroll",
      value: loading ? <Skeleton className="h-8 w-20" /> : `AED ${(stats.monthlyPayroll.amount / 1000).toFixed(1)}K`,
      description: "Current month total",
      icon: DollarSign,
      trend: stats.monthlyPayroll.trend
    },
    {
      title: "Pending Payruns",
      value: loading ? <Skeleton className="h-8 w-8" /> : stats.activePayruns.count.toString(),
      description: "Awaiting processing",
      icon: Calendar,
      trend: stats.activePayruns.trend
    }
  ]

  const quickActions = [
    {
      title: "Add New Employer",
      description: "Onboard a new client company",
      icon: Building,
      href: "/kounted/payroll/employers/new",
      color: "bg-primary"
    },
    {
      title: "Add Employee",
      description: "Register new employee",
      icon: Users,
      href: "/kounted/payroll/employees/new",
      color: "bg-primary"
    },
    {
      title: "Create Payrun",
      description: "Process monthly payroll",
      icon: FileText,
      href: "/kounted/payroll/payruns/new",
      color: "bg-primary"
    },
    {
      title: "Review Claims",
      description: "Approve expense claims",
      icon: Receipt,
      href: "/kounted/payroll/expenses",
      color: "bg-primary"
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

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <h1 className="text-xs font-bold">Error Loading Dashboard</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-zinc-400">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-md font-bold tracking-tight">Payroll under Management</h1>
          <p className="text-zinc-400 text-sm">
            Comprehensive payroll management for UAE businesses
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/kounted/payroll/reports">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </Link>
          <Link href="/kounted/payroll/payruns/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Payrun
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle className="text-xs font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-xs font-bold">{stat.value}</div>
              <p className="text-xs text-zinc-400">
                {stat.description}
              </p>
              <div className="flex items-center mt-2">
                {loading ? (
                  <Skeleton className="h-3 w-20" />
                ) : (
                  <>
                    {stat.trend.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-primary mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                    )}
                    <span className={`text-xs ${stat.trend.isPositive ? 'text-primary' : 'text-destructive'}`}>
                      {stat.trend.description}
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="border-none">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <CardDescription>
                Common payroll tasks and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-foreground grid gap-4 md:grid-cols-2 border-none">
                {quickActions.map((action) => (
                  action.href ? (
                    <Link key={action.title} href={action.href}>
                      <Card className="cursor-pointer text-foreground bg-zinc-100 hover:bg-primary hover:text-primary-foreground transition-colors border-none">
                        <CardContent className="p-2">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-md ${action.color}`}>
                              <action.icon className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{action.title}</h3>
                              <p className="text-xs ">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ) : (
                    <Card key={action.title} className="opacity-50 cursor-not-allowed border-none">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-md ${action.color}`}>
                            <action.icon className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{action.title}</h3>
                            <p className="text-xs text-zinc-400">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-none">
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
                    <p className="text-xs font-medium">{activity.action}</p>
                    <p className="text-xs text-zinc-400">{activity.time}</p>
                  </div>
                  <p className="text-xs text-zinc-400">{activity.company}</p>
                  {activity.amount && (
                    <p className="text-xs font-semibold text-primary">{activity.amount}</p>
                  )}
                  {activity.employee && (
                    <p className="text-xs text-primary">{activity.employee}</p>
                  )}
                  {activity.details && (
                    <p className="text-xs text-orange-600">{activity.details}</p>
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