'use client'

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        {/* Sidebar */}
        <div className="hidden border-r bg-zinc-100 md:block">
          <AppSidebar />
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col">
          <TopNavbar />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
