// components/dashboard-layout/TopNavbar.tsx

'use client'

import { Bell, User, Settings, LogOut, HomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { sidebarSections } from "@/lib/config/sidebar-nav"
import { Logo, Logomark } from '@/components/advontier-website/Logo'

export function TopNavbar() {
  const pathname = usePathname();
  // Split and filter empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Helper to find a friendly name for a segment
  function getBreadcrumbName(segment: string, fullPath: string) {
    // Search sidebarSections for a matching url
    for (const section of sidebarSections) {
      if (section.items) {
        for (const item of section.items) {
          if (item.url === fullPath) return item.title;
        }
      }
    }
    // Fallback: Capitalize segment
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  // Build breadcrumbs array: { name, href }
  const breadcrumbs = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    return {
      name: getBreadcrumbName(segment, href),
      href,
    };
  });

  return (
    <header className="text-sm h-24 text-zinc-100 bg-zinc-900 shadow-sm shadow-zinc-100 font-semibold backdrop-blur supports-[backdrop-filter]:bg-zinc-900 top-0 z-50 sticky overflow-hidden">
      <div className="h-full flex items-center justify-between px-4 relative z-10">
      {/* Left side - Sidebar trigger and breadcrumb */}
        <div className="flex items-center gap-3">
          <Logomark invert={false} className="h-4 w-4 rounded-full" />
          <SidebarTrigger className="h-12 w-12 rounded-r-full hover:bg-accent" />
          <nav className="hidden md:flex items-center gap-2" aria-label="Breadcrumb">
            {breadcrumbs.length === 0 ? (
              <span className="text-muted-foreground font-medium">Advontier</span>
            ) : (
              <>
                <span className="text-primary font-bold">&#8759;</span>
                {breadcrumbs.map((crumb, idx) => (
                  <span key={crumb.href} className="flex items-center gap-2">
                    {idx < breadcrumbs.length - 1 ? (
                      <>
                        <Link href={crumb.href} className="text-primary hover:underline">{crumb.name}</Link>
                        <span className="text-primary">/</span>
                      </>
                    ) : (
                      <span className="font-medium">{crumb.name}</span>
                    )}
                  </span>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/team/ben_jacob.png" alt="User" />
                  <AvatarFallback>KC</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline font-medium">Ben Jacobs</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Ben Jacobs</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    kevin@kounted.ae
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}