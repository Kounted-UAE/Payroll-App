// DashboardLayout.tsx
'use client'

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col">
          <TopNavbar />
          <main className="flex-1 p-2">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
