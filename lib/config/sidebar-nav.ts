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
        { title: "Dashboard", url: "#", icon: PieChart },
        { title: "Reports", url: "#", icon: BarChart2 },
      ],
      collapsible: false,
    },
    {
      label: "Client Profiles",
      items: [
        { title: "Corporate Entities", url: "#", icon: Users },
        { title: "Private Individuals", url: "#", icon: Users },      ],
    },
    {
      label: "Sales Tools",
      items: [
        { title: "$KWAY CPQ", url: "#", icon: RocketIcon },
        { title: "$KORP Kiosk", url: "#", icon: ShoppingCart },
      ],
    },
    {
      label: "Payroll Tools",
      items: [
        { title: "Payroll Dashboard", url: "/payroll", icon: BarChart3 },
            { title: "Employers", url: "/payroll/employers", icon: Building },
            { title: "Employees", url: "/payroll/employees", icon: Users },
            { title: "Salary Structures", url: "/payroll/salary-structures", icon: DollarSign },
            { title: "Payruns", url: "/payroll/payruns", icon: Calendar },
            { title: "Payslips", url: "/payroll/payslips", icon: FileText },
            { title: "Expense Claims", url: "/payroll/expenses", icon: Receipt },
            { title: "Reports", url: "/payroll/reports", icon: BarChart3 },
      ],
    },
    
    
    {
      label: "Support Tools",
      items: [{ title: "KYC Compliance", url: "#", icon: Briefcase }],
    },
    {
      label: "Resource Centre",
      items: [
        { title: "Guides", url: "/sop-resources", icon: BookOpen },
        { title: "Manage SOPs", url: "/sop-resources/manage", icon: FolderOpen },
        { title: "Compliance Calendar", url: "/compliance-calendar", icon: CheckSquare },
        { title: "Templates", url: "#", icon: LayoutTemplate },
        { title: "Quick Links", url: "#", icon: LinkIcon },
      ],
    },
    {
      label: "Admin",
      items: [
        { title: "Component Library", url: "#", icon: PanelTopInactiveIcon },        
      ],
    },
    {
      label: "Settings",
      items: [{ title: "Settings", url: "#", icon: Settings }],
      collapsible: false,
    },
  ]
  