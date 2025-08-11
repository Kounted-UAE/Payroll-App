'use client'

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { sidebarSections } from "@/lib/config/sidebar-nav"
import { SidebarTrigger } from "./sidebar-trigger"

interface BreadcrumbItem {
  name: string
  href: string
}

export function NavigationBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  
  // Remove 'backyard' from segments since it's our dashboard base
  const dashboardSegments = segments[0] === 'backyard' ? segments.slice(1) : segments

  function getBreadcrumbName(segment: string, fullPath: string): string {
    for (const section of sidebarSections) {
      if (section.items) {
        for (const item of section.items) {
          if (item.url === fullPath) return item.title
        }
      }
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  const breadcrumbs: BreadcrumbItem[] = dashboardSegments.map((segment, idx) => {
    const href = "/backyard/" + dashboardSegments.slice(0, idx + 1).join("/")
    return { name: getBreadcrumbName(segment, href), href }
  })

  return (
    <div className="text-lowercase text-xs flex items-center gap-3 px-4 mb-2 bg-gradient-to-l from-slate-800 to-slate-900 backdrop-blur rounded-t-xl shadow-sm">
      <SidebarTrigger className="h-8 w-8 rounded-lg hover:bg-white/50" />
      <nav className="flex items-center gap-2" aria-label="Breadcrumb">
        {dashboardSegments.length === 0 ? (
          <span className="text-blue-100 font-semibold">Home</span>
        ) : (
          <>
            <Link href="/backyard" className="text-blue-100 hover:underline font-bold">
              Home
            </Link>
            <span className="text-blue-200 font-normal">/</span>
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {idx < breadcrumbs.length - 1 ? (
                  <>
                    <Link href={crumb.href} className="text-blue-200 hover:underline font-medium">
                      {crumb.name}
                    </Link>
                    <span className="text-blue-200">/</span>
                  </>
                ) : (
                  <span className="text-blue-300 font-semibold">{crumb.name}</span>
                )}
              </span>
            ))}
          </>
        )}
      </nav>
    </div>
  )
} 