// DashboardLayout.tsx
'use client'

import React from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";
import { useSidebar } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
      <div className="flex min-h-screen w-full flex-col">
        {/* Top Navbar - Full width across the top */}
        <TopNavbar />
        
        {/* Main content area with sidebar and page content */}
        <div className="flex flex-1">
          {/* Sidebar - Starts below navbar */}
          <div className={React.useMemo(() => 
            `hidden md:block flex-shrink-0 rounded-xl transition-all duration-300 ${
              collapsed ? 'w-16' : 'w-64'
            }`, 
            [collapsed]
          )}>
            <AppSidebar />
          </div>

          {/* Page content - To the right of sidebar */}
          <main className="flex-1 p-2 m-8 bg-gradient-to-tr from-white via-zinc-50 to-zinc-100 rounded-2xl">
            {children}
          </main>
        </div>
      </div>
  );
}
