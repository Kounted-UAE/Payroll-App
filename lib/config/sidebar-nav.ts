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
        { title: "Dashboard", url: "/kounted", icon: PieChart, status: "active" },
        { title: "Reports", url: "#", icon: BarChart2, status: "wip" },
      ],
      collapsible: false,
    },
    {
      label: "Admin",
      items: [
        { title: "Dev Progress", url: "/kounted/admin/dev-progress", icon: GitBranch, status: "active" },
        { title: "Excel File Payslips", url: "/kounted/admin/temp-excelpayrun-import", icon: FileSpreadsheet, status: "active" },       
        { title: "Xero Config", url: "/kounted/admin/xero-config", icon: FileSpreadsheet, status: "wip" },       
      ],
    },
    {
      label: "Client Profiles",
      items: [
              { title: "Airtable", url: "/kounted/clients", icon: Users, status: "wip" },      ],
    },
    {
      label: "Sales Tools",
      items: [
        { title: "Referral Programs", url: "/kounted/referral-programs", icon: RocketIcon, status: "active" },
        { title: "$Kwiver CPQ", url: "/kounted/kwiver-cpq", icon: RocketIcon, status: "active" },
        { title: "$Kwiver Kiosk", url: "/kounted/kwiver-kiosk", icon: ShoppingCart, status: "active" },
      ],
    },
    {
      label: "Specialist Agents",
      items: [
        { title: "Agents", url: "/kounted/agents", icon: Briefcase, status: "wip" },
      ],
    },
    {
      label: "Payroll Tools",
      items: [
        { title: "kounted Payroll", url: "/kounted/payroll", icon: BarChart3, status: "active" },
        { title: "Employers", url: "/kounted/payroll/employers", icon: Building, status: "active" },
        { title: "Employees", url: "/kounted/payroll/employees", icon: Users, status: "active" },
        { title: "Payroll Payruns", url: "/kounted/payroll/payruns", icon: BarChart3, status: "active" },
        { title: "Payslips", url: "/kounted/payroll/payslips", icon: FileText, status: "active" },
        { title: "Expense Claims", url: "/kounted/payroll/expenses", icon: Receipt, status: "active" },
        { title: "Payroll Reports", url: "/kounted/payroll/reports", icon: BarChart3, status: "active" },
      ],
    },    
    {
      label: "Support Tools",
      items: [{ title: "KYC Compliance", url: "#", icon: Briefcase, status: "wip" }],
    },
    {
      label: "Resource Centre",
      items: [
        { title: "Key Dates", url: "/kounted/compliance-calendar", icon: Calendar, status: "wip" },
        { title: "kounted SOPs", url: "/kounted/sop-resources", icon: BookOpen, status: "wip" },         
        { title: "Templates", url: "#", icon: LayoutTemplate, status: "wip" },
        { title: "Info Links", url: "#", icon: LinkIcon, status: "wip" },
      ],
    },
   
    {
      label: "Settings",
      items: [{ title: "Settings", url: "/kounted/settings", icon: Settings, status: "coming-soon" }],
      collapsible: false,
    },
  ]
  