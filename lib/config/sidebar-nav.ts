// lib/config/sidebar-nav.ts

import {
    Users, FileText, ShoppingCart, CheckSquare, Settings, PanelTopInactiveIcon, PieChart, 
     Calendar, DollarSign, Building, Receipt, BarChart3, BarChart2 , RocketIcon,
    BookOpen, FolderOpen, Link as LinkIcon, LayoutTemplate, Briefcase, FileSpreadsheet, GitBranch
  } from "lucide-react"
  
  export const sidebarSections = [
    {
      label: "Navigation",
      items: [
        { title: "Dashboard", url: "/advontier", icon: PieChart, status: "active" },
        { title: "Reports", url: "#", icon: BarChart2, status: "wip" },
      ],
      collapsible: false,
    },
    {
      label: "Admin",
      items: [
        { title: "Dev Progress", url: "/advontier/admin/dev-progress", icon: GitBranch, status: "active" },
        { title: "Excel File Payslips", url: "/advontier/admin/temp-excelpayrun-import", icon: FileSpreadsheet, status: "active" },       
        { title: "Xero Config", url: "/advontier/admin/xero-config", icon: FileSpreadsheet, status: "wip" },       
      ],
    },
    {
      label: "Client Profiles",
      items: [
              { title: "Airtable", url: "/advontier/clients", icon: Users, status: "wip" },      ],
    },
    {
      label: "Sales Tools",
      items: [
        { title: "Referral Programs", url: "/advontier/referral-programs", icon: RocketIcon, status: "active" },
        { title: "$Kwiver CPQ", url: "/advontier/kwiver-cpq", icon: RocketIcon, status: "active" },
        { title: "$Kwiver Kiosk", url: "/advontier/kwiver-kiosk", icon: ShoppingCart, status: "active" },
      ],
    },
    {
      label: "Specialist Agents",
      items: [
        { title: "Agents", url: "/advontier/agents", icon: Briefcase, status: "wip" },
      ],
    },
    {
      label: "Payroll Tools",
      items: [
        { title: "Advontier Payroll", url: "/advontier/payroll", icon: BarChart3, status: "active" },
        { title: "Employers", url: "/advontier/payroll/employers", icon: Building, status: "active" },
        { title: "Employees", url: "/advontier/payroll/employees", icon: Users, status: "active" },
        { title: "Payroll Payruns", url: "/advontier/payroll/payruns", icon: BarChart3, status: "active" },
        { title: "Payslips", url: "/advontier/payroll/payslips", icon: FileText, status: "active" },
        { title: "Expense Claims", url: "/advontier/payroll/expenses", icon: Receipt, status: "active" },
        { title: "Payroll Reports", url: "/advontier/payroll/reports", icon: BarChart3, status: "active" },
      ],
    },    
    {
      label: "Support Tools",
      items: [{ title: "KYC Compliance", url: "#", icon: Briefcase, status: "wip" }],
    },
    {
      label: "Resource Centre",
      items: [
        { title: "Key Dates", url: "/advontier/compliance-calendar", icon: Calendar, status: "wip" },
        { title: "Advontier SOPs", url: "/advontier/sop-resources", icon: BookOpen, status: "wip" },         
        { title: "Templates", url: "#", icon: LayoutTemplate, status: "wip" },
        { title: "Info Links", url: "#", icon: LinkIcon, status: "wip" },
      ],
    },
   
    {
      label: "Settings",
      items: [{ title: "Settings", url: "/advontier/settings", icon: Settings, status: "coming-soon" }],
      collapsible: false,
    },
  ]
  