// DashboardLayout.tsx
'use client'

import React from "react";
import { AppSidebar } from "./AppSidebar";
import { TopNavbar } from "./TopNavbar";
import { useSidebar } from "./sidebar-context";
import { NavigationBreadcrumb } from "./navigation-breadcrumb";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
      <div className="flex min-h-screen w-full flex-col bg-white ">
        {/* Top Navbar - Full width across the top */}
        <TopNavbar />
        
        {/* Main content area with sidebar and page content */}
        <div className="flex flex-1 bg-white">
          {/* Sidebar - Starts below navbar */}
          <div className={React.useMemo(() => 
            `hidden md:block flex-shrink-0 transition-all duration-300 ${
              collapsed ? 'w-20' : 'w-64'
            }`, 
            [collapsed]
          )}>
            <AppSidebar />
          </div>

          {/* Page content area with breadcrumbs */}
          <div className="flex-1 flex flex-col ">
            {/* Breadcrumb section above page content */}
            <NavigationBreadcrumb />

            {/* Page content */}
            <main className="flex-1 bg-white shadow-inner-xl shadow-slate-900">
              {children}
            </main>
          </div>
        </div>
      </div>
  );
}
