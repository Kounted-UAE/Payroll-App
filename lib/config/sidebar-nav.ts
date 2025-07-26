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
        { title: "Reports", url: "#", icon: BarChart2, status: "coming-soon" },
      ],
      collapsible: false,
    },
    {
      label: "Client Profiles",
      items: [
        { title: "Corporate Entities", url: "#", icon: Users, status: "coming-soon" },
        { title: "Private Individuals", url: "#", icon: Users, status: "coming-soon" },      ],
    },
    {
      label: "Sales Tools",
      items: [
        { title: "$KWAY CPQ", url: "/backyard/kway-cpq", icon: RocketIcon, status: "coming-soon" },
        { title: "$KORP Kiosk", url: "/backyard/korp-kiosk", icon: ShoppingCart, status: "coming-soon" },
      ],
    },
    {
      label: "Payroll Tools",
      items: [
        { title: "Payroll Dashboard", url: "/backyard/payroll", icon: BarChart3, status: "active" },
            { title: "Employers", url: "/backyard/payroll/employers", icon: Building, status: "active" },
            { title: "Employees", url: "/backyard/payroll/employees", icon: Users, status: "active" },
            { title: "Salary Structures", url: "/backyard/payroll/salary-structures", icon: DollarSign, status: "active" },
            { title: "Payruns", url: "/backyard/payroll/payruns", icon: Calendar, status: "active" },
            { title: "Payslips", url: "/backyard/payroll/payslips", icon: FileText, status: "active" },
            { title: "Expense Claims", url: "/backyard/payroll/expenses", icon: Receipt, status: "active" },
            { title: "Reports", url: "/backyard/payroll/reports", icon: BarChart3, status: "active" },
      ],
    },
    
    
    {
      label: "Support Tools",
      items: [{ title: "KYC Compliance", url: "#", icon: Briefcase, status: "coming-soon" }],
    },
    {
      label: "Resource Centre",
      items: [
        { title: "Guides", url: "/backyard/sop-resources", icon: BookOpen, status: "active" },
        { title: "Manage SOPs", url: "/backyard/sop-resources/manage", icon: FolderOpen, status: "active" },
        { title: "Compliance Calendar", url: "/backyard/compliance-calendar", icon: CheckSquare, status: "active" },
        { title: "Templates", url: "#", icon: LayoutTemplate, status: "coming-soon" },
        { title: "Quick Links", url: "#", icon: LinkIcon, status: "coming-soon" },
      ],
    },
    {
      label: "Admin",
      items: [
        { title: "Component Library", url: "/backyard/admin/component-library", icon: PanelTopInactiveIcon, status: "coming-soon" },        
      ],
    },
    {
      label: "Settings",
      items: [{ title: "Settings", url: "#", icon: Settings, status: "active" }],
      collapsible: false,
    },
  ]
  