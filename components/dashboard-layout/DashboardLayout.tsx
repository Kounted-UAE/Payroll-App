// DashboardLayout.tsx
'use client'

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        {/* Top Navbar - Full width across the top */}
        <TopNavbar />
        
        {/* Main content area with sidebar and page content */}
        <div className="flex flex-1">
          {/* Sidebar - Starts below navbar */}
          <div className="hidden md:block">
            <AppSidebar />
          </div>

          {/* Page content - To the right of sidebar */}
          <main className="flex-1 p-2 transition-[margin-left] duration-200 ease-linear md:ml-[var(--sidebar-width,16rem)]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
