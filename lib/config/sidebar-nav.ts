// lib/config/sidebar-nav.ts

import {
    Users, FileText, ShoppingCart, CheckSquare, Settings, PanelTopInactiveIcon, PieChart, 
     Calendar, DollarSign, Building, Receipt, BarChart3, BarChart2 , RocketIcon,
    BookOpen, FolderOpen, Link as LinkIcon, LayoutTemplate, Briefcase, FileSpreadsheet
  } from "lucide-react"
  
  export const sidebarSections = [
    {
      label: "Navigation",
      items: [
        { title: "Dashboard", url: "/backyard", icon: PieChart, status: "active" },
        { title: "Reports", url: "#", icon: BarChart2, status: "active" },
      ],
      collapsible: false,
    },
    {
      label: "Client Profiles",
      items: [
              { title: "Airtable", url: "/backyard/clients", icon: Users, status: "active" },      ],
    },
    {
      label: "Sales Tools",
      items: [
        { title: "$KWAY CPQ", url: "/backyard/kway-cpq", icon: RocketIcon, status: "active" },
        { title: "$KORP Kiosk", url: "/backyard/korp-kiosk", icon: ShoppingCart, status: "active" },
      ],
    },
    {
      label: "Payroll Tools",
      items: [
        { title: "Kounted Payroll", url: "/backyard/payroll", icon: BarChart3, status: "active" },
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
      items: [{ title: "KYC Compliance", url: "#", icon: Briefcase, status: "active" }],
    },
    {
      label: "Resource Centre",
      items: [
        { title: "Key Dates", url: "/backyard/compliance-calendar", icon: Calendar, status: "active" },
        { title: "Kounted SOPs", url: "/backyard/sop-resources", icon: BookOpen, status: "active" },         
        { title: "Templates", url: "#", icon: LayoutTemplate, status: "active" },
        { title: "Info Links", url: "#", icon: LinkIcon, status: "active" },
      ],
    },
    {
      label: "Admin",
      items: [
        { title: "Historic Payruns", url: "/backyard/admin/temp-payrun-history", icon: PanelTopInactiveIcon, status: "active" },        
        { title: "Excel File Payslips", url: "/backyard/admin/temp-excelpayrun-import", icon: FileSpreadsheet, status: "active" },       
      ],
    },
    {
      label: "Settings",
      items: [{ title: "Settings", url: "/backyard/settings", icon: Settings, status: "active" }],
      collapsible: false,
    },
  ]
  