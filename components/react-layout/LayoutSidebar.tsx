// components/react-layout/Sidebar-Layout.tsx

'use client'

import { ReactNode } from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/react-layout/Sidebar"

interface SidebarLayoutProps {
  sidebar: ReactNode
  navbar: ReactNode
  children: ReactNode
}

export function SidebarLayout({ sidebar, navbar, children }: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        {sidebar}
      </Sidebar>
      <SidebarInset>
        <div className="sticky top-0 z-10 bg-background px-4 pt-2 sm:px-6 lg:px-8">
          {navbar}
        </div>
        <div className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
