import React from "react"
import { 
  Home, 
  Palette, 
  Settings, 
  Users, 
  FileText, 
  Search,
  ChevronDown,
  Plus,
  Code,
  Calendar,
  CheckSquare,
  DollarSign,
  Building,
  Receipt,
  BarChart3,
  BookOpen,
  FolderOpen,
  ShoppingCart
} from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Client Management", url: "/clients", icon: Users },
  { title: "Order Kiosk", url: "/order-kiosk", icon: FileText },
  { title: "$KORP Kiosk", url: "/korp-kiosk", icon: ShoppingCart },
  { title: "Compliance Calendar", url: "/compliance-calendar", icon: CheckSquare },
  { title: "Settings", url: "/settings", icon: Settings },
]

const payrollItems = [
  { title: "Payroll Dashboard", url: "/payroll", icon: BarChart3 },
  { title: "Employers", url: "/payroll/employers", icon: Building },
  { title: "Employees", url: "/payroll/employees", icon: Users },
  { title: "Salary Structures", url: "/payroll/salary-structures", icon: DollarSign },
  { title: "Payruns", url: "/payroll/payruns", icon: Calendar },
  { title: "Payslips", url: "/payroll/payslips", icon: FileText },
  { title: "Expense Claims", url: "/payroll/expenses", icon: Receipt },
  { title: "Reports", url: "/payroll/reports", icon: BarChart3 },
]

const resourceItems = [
  { title: "SOP Resources", url: "/sop-resources", icon: BookOpen },
  { title: "Manage SOPs", url: "/sop-resources/manage", icon: FolderOpen },
]

const componentCategories = [
  { title: "Cards", url: "/components/cards", icon: Code },
  { title: "Forms", url: "/components/forms", icon: Code },
  { title: "Charts", url: "/components/charts", icon: Code },
  { title: "Widgets", url: "/components/widgets", icon: Code },
  { title: "Tables", url: "/components/tables", icon: Code },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isComponentsExpanded, setIsComponentsExpanded] = React.useState(true)
  const [isPayrollExpanded, setIsPayrollExpanded] = React.useState(true)
  const [isResourcesExpanded, setIsResourcesExpanded] = React.useState(true)

  const isActive = (path: string) => pathname === path
  const getNavCls = (path: string) =>
    isActive(path) ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"

  const filteredMainItems = mainItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPayrollItems = payrollItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredResourceItems = resourceItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredComponentCategories = componentCategories.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const collapsed = state === "collapsed"

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border">
        {!collapsed && (
          <div className="p-4">
            <h2 className="text-lg font-semibold text-foreground">Accounting Firm</h2>
            <p className="text-sm text-muted-foreground">Client Portal</p>
          </div>
        )}
        {collapsed && (
          <div className="p-2 flex justify-center">
            <Code className="h-6 w-6 text-primary" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Search */}
        {!collapsed && (
          <div className="p-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className={getNavCls(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-4" />

        {/* UAE Payroll Section */}
        <SidebarGroup>
          {!collapsed && (
            <div className="flex items-center justify-between px-3 py-2">
              <SidebarGroupLabel>UAE Payroll</SidebarGroupLabel>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPayrollExpanded(!isPayrollExpanded)}
                className="h-auto p-1 hover:bg-accent"
              >
                <ChevronDown className={`h-3 w-3 transition-transform ${
                  isPayrollExpanded ? 'rotate-0' : '-rotate-90'
                }`} />
              </Button>
            </div>
          )}
          
          {(collapsed || isPayrollExpanded) && (
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredPayrollItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={getNavCls(item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <Separator className="mx-4" />

        {/* Resource Centre Section */}
        <SidebarGroup>
          {!collapsed && (
            <div className="flex items-center justify-between px-3 py-2">
              <SidebarGroupLabel>Resource Centre</SidebarGroupLabel>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
                className="h-auto p-1 hover:bg-accent"
              >
                <ChevronDown className={`h-3 w-3 transition-transform ${
                  isResourcesExpanded ? 'rotate-0' : '-rotate-90'
                }`} />
              </Button>
            </div>
          )}
          
          {(collapsed || isResourcesExpanded) && (
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredResourceItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={getNavCls(item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        <Separator className="mx-4" />

        {/* Component Categories */}
        <SidebarGroup>
          {!collapsed && (
            <div className="flex items-center justify-between px-3 py-2">
              <SidebarGroupLabel>Components</SidebarGroupLabel>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsComponentsExpanded(!isComponentsExpanded)}
                className="h-auto p-1 hover:bg-accent"
              >
                <ChevronDown className={`h-3 w-3 transition-transform ${
                  isComponentsExpanded ? 'rotate-0' : '-rotate-90'
                }`} />
              </Button>
            </div>
          )}
          
          {(collapsed || isComponentsExpanded) && (
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredComponentCategories.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className={getNavCls(item.url)}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        {!collapsed && (
          <div className="p-4">
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
              <Plus className="h-3 w-3" />
              New Component
            </Button>
          </div>
        )}
        {collapsed && (
          <div className="p-2 flex justify-center">
            <Button variant="outline" size="sm" className="p-2">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}