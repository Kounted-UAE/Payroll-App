// config/navigation/sidebar.config.ts
import { Users, ClipboardList, Settings, CreditCard, FileText, LayoutDashboard } from "lucide-react";

export const sidebarNav = [
  {
    label: "Navigation",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Client Management", icon: Users, href: "/dashboard/clients" },
      { label: "Order Kiosk", icon: CreditCard, href: "/dashboard/order-kiosk" },
      { label: "SKORP Kiosk", icon: CreditCard, href: "/dashboard/skorp-kiosk" },
      { label: "Compliance Calendar", icon: ClipboardList, href: "/dashboard/compliance-calendar" },
      { label: "Settings", icon: Settings, href: "/dashboard/settings" },
    ],
  },
  {
    label: "UAE Payroll",
    items: [
      { label: "Payroll Dashboard", icon: LayoutDashboard, href: "/dashboard/payroll" },
      { label: "Employers", icon: Users, href: "/dashboard/payroll/employers" },
      { label: "Employees", icon: Users, href: "/dashboard/payroll/employees" },
      { label: "Salary Structures", icon: FileText, href: "/dashboard/payroll/salary-structures" },
      { label: "Payruns", icon: FileText, href: "/dashboard/payroll/payruns" },
      { label: "Payslips", icon: FileText, href: "/dashboard/payroll/payslips" },
      { label: "Expense Claims", icon: FileText, href: "/dashboard/payroll/expenses" },
      { label: "Reports", icon: FileText, href: "/dashboard/payroll/reports" },
    ],
  },
  {
    label: "Resource Centre",
    items: [
      { label: "SOP Resources", icon: FileText, href: "/dashboard/sop-resources" },
      { label: "Manage SOPs", icon: FileText, href: "/dashboard/sop-resources/manage" },
    ],
  },
  {
    label: "Components",
    items: [
      { label: "Cards", icon: FileText, href: "/dashboard/components/cards" },
      { label: "Forms", icon: FileText, href: "/dashboard/components/forms" },
      { label: "Charts", icon: FileText, href: "/dashboard/components/charts" },
      { label: "Widgets", icon: FileText, href: "/dashboard/components/widgets" },
      { label: "Tables", icon: FileText, href: "/dashboard/components/tables" },
    ],
  },
];