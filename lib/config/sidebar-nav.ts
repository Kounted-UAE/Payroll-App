// lib/config/sidebar-nav.ts

import {
    Users, FileText, ShoppingCart, CheckSquare, Settings, PanelTopInactiveIcon, PieChart, 
     Calendar, DollarSign, Building, Receipt, BarChart3, BarChart2 , RocketIcon,
    BookOpen, FolderOpen, Link as LinkIcon, LayoutTemplate, Briefcase
  } from "lucide-react"
  
  export const sidebarSections = [
    {
      label: "Navigation",
      items: [
        { title: "Dashboard", url: "/backyard", icon: PieChart, status: "active" },
        { title: "Reports", url: "#", icon: BarChart2, status: "locked" },
      ],
      collapsible: false,
    },
    {
      label: "Client Profiles",
      items: [
        { title: "Corporate Entities", url: "#", icon: Users, status: "locked" },
        { title: "Private Individuals", url: "#", icon: Users, status: "locked" },      ],
    },
    {
      label: "Sales Tools",
      items: [
        { title: "$KWAY CPQ", url: "/backyard/kway-cpq", icon: RocketIcon, status: "locked" },
        { title: "$KORP Kiosk", url: "/backyard/korp-kiosk", icon: ShoppingCart, status: "locked" },
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
      items: [{ title: "KYC Compliance", url: "#", icon: Briefcase, status: "locked" }],
    },
    {
      label: "Resource Centre",
      items: [
        { title: "Key Dates", url: "/backyard/compliance-calendar", icon: Calendar, status: "active" },
        { title: "Kounted SOPs", url: "/backyard/sop-resources", icon: BookOpen, status: "active" },         
        { title: "Templates", url: "#", icon: LayoutTemplate, status: "locked" },
        { title: "Info Links", url: "#", icon: LinkIcon, status: "locked" },
      ],
    },
    {
      label: "Admin",
      items: [
        { title: "Historic Payruns", url: "/backyard/admin/temp-payrun-history", icon: PanelTopInactiveIcon, status: "active" },        
      ],
    },
    {
      label: "Settings",
      items: [{ title: "Settings", url: "/backyard/settings", icon: Settings, status: "active" }],
      collapsible: false,
    },
  ]
  