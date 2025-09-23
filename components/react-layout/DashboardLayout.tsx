// DashboardLayout.tsx
'use client'

import React from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";
import { useSidebar } from "./sidebar-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
      <div className="flex min-h-screen w-full flex-col bg-white">
        {/* Top Navbar - Fixed at top */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <TopNavbar />
        </div>
        
        {/* Main content area - starts below navbar */}
        <div className="flex flex-1 bg-white pt-20">
          {/* Sidebar - Fixed positioned, no container needed */}
          <AppSidebar />

          {/* Page content area - Add left margin to account for fixed sidebar */}
          <div className={React.useMemo(() => 
            `flex-1 flex flex-col transition-all duration-300 ${
              collapsed ? 'ml-[5rem]' : 'ml-[16rem]'
            }`, 
            [collapsed]
          )}>
            {/* Page content */}
            <main className="flex-1 bg-white shadow-inner-xl shadow-slate-900">
              {children}
            </main>
          </div>
        </div>
      </div>
  );
}
