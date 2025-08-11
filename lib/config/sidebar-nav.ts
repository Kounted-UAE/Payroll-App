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
        { title: "Dashboard", url: "/backyard", icon: PieChart, status: "active" },
        { title: "Reports", url: "#", icon: BarChart2, status: "wip" },
      ],
      collapsible: false,
    },
    {
      label: "Admin",
      items: [
        { title: "Dev Progress", url: "/backyard/admin/dev-progress", icon: GitBranch, status: "active" },
        { title: "Excel File Payslips", url: "/backyard/admin/temp-excelpayrun-import", icon: FileSpreadsheet, status: "active" },       
        { title: "Xero Config", url: "/backyard/admin/xero-config", icon: FileSpreadsheet, status: "wip" },       
      ],
    },
    {
      label: "Client Profiles",
      items: [
              { title: "Airtable", url: "/backyard/clients", icon: Users, status: "wip" },      ],
    },
    {
      label: "Sales Tools",
      items: [
        { title: "Referral Programs", url: "/backyard/referral-programs", icon: RocketIcon, status: "active" },
        { title: "$Kwiver CPQ", url: "/backyard/kwiver-cpq", icon: RocketIcon, status: "active" },
        { title: "$Kwiver Kiosk", url: "/backyard/kwiver-kiosk", icon: ShoppingCart, status: "active" },
      ],
    },
    {
      label: "Specialist Agents",
      items: [
        { title: "Agents", url: "/backyard/agents", icon: Briefcase, status: "wip" },
      ],
    },
    {
      label: "Payroll Tools",
      items: [
        { title: "Advontier Payroll", url: "/backyard/payroll", icon: BarChart3, status: "active" },
        { title: "Employers", url: "/backyard/payroll/employers", icon: Building, status: "active" },
        { title: "Employees", url: "/backyard/payroll/employees", icon: Users, status: "active" },
        { title: "Payroll Payruns", url: "/backyard/payroll/payruns", icon: BarChart3, status: "active" },
        { title: "Payslips", url: "/backyard/payroll/payslips", icon: FileText, status: "active" },
        { title: "Expense Claims", url: "/backyard/payroll/expenses", icon: Receipt, status: "active" },
        { title: "Payroll Reports", url: "/backyard/payroll/reports", icon: BarChart3, status: "active" },
      ],
    },    
    {
      label: "Support Tools",
      items: [{ title: "KYC Compliance", url: "#", icon: Briefcase, status: "wip" }],
    },
    {
      label: "Resource Centre",
      items: [
        { title: "Key Dates", url: "/backyard/compliance-calendar", icon: Calendar, status: "wip" },
        { title: "Advontier SOPs", url: "/backyard/sop-resources", icon: BookOpen, status: "wip" },         
        { title: "Templates", url: "#", icon: LayoutTemplate, status: "wip" },
        { title: "Info Links", url: "#", icon: LinkIcon, status: "wip" },
      ],
    },
   
    {
      label: "Settings",
      items: [{ title: "Settings", url: "/backyard/settings", icon: Settings, status: "coming-soon" }],
      collapsible: false,
    },
  ]
  