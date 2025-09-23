// lib/config/sidebar-nav.ts

import {
    Users, FileText, ShoppingCart, CheckSquare, Settings, PanelTopInactiveIcon, PieChart, 
     Calendar, DollarSign, Building, Receipt, BarChart3, BarChart2 , RocketIcon,
    BookOpen, FolderOpen, Link as LinkIcon, LayoutTemplate, Briefcase, FileSpreadsheet, GitBranch
  } from "lucide-react"

export interface SidebarItem {
  title: string
  url: string
  icon: any
  status?: "active" | "wip" | "locked"
}

export interface SidebarSection {
  label: string
  items: SidebarItem[]
  collapsible?: boolean
}
  
export const sidebarSections: SidebarSection[] = [
  {
    label: "Payroll Tools",
    items: [
      { title: "Payroll Dashboard", url: "/suite/payroll", icon: FileSpreadsheet, status: "active" },       
    ],
    collapsible: false,
  },
]
  