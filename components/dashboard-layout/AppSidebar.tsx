// FILE: components/layout/AppSidebar.tsx

'use client'

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Search, ChevronDown, Plus } from "lucide-react"
import Image from "next/image"

import { sidebarSections } from "@/lib/config/sidebar-nav"

export function AppSidebar() {
  const { state } = useSidebar()
  const pathname = usePathname()
  const collapsed = state === "collapsed"

  const [searchQuery, setSearchQuery] = React.useState("")
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const isActive = (path: string) => pathname === path
  const getNavCls = (path: string) =>
    isActive(path)
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"

  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="shadow-sm border-b border-border bg-zinc-100">
        {!collapsed ? (
          <div className="p-4">
            <div className="flex items-center gap-2"><Image src="/icons/kounted_Icon_green_light.webp" alt="Kounted Logo" width={32} height={32} />
              <div className="flex flex-col">
                <h2 className="text-md font-bold text-brand-charcoal">Kounted's Backyard</h2>
                <p className="text-[10px] text-brand-charcoal">
                  powered by <span className="text-green-600">advontier.com</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2 flex justify-center">
            <span className="h-10 w-10 bg-primary rounded-full" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {!collapsed && (
          <div className="p-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}

        {sidebarSections.map((section) => (
          <SidebarGroup key={section.label}>
            {!collapsed && (
              <div className="flex items-center justify-between px-3 py-2">
                <SidebarGroupLabel className="text-[10px] font-semibold text-brand-light uppercase tracking-tight">
                  {section.label}
                </SidebarGroupLabel>
                {section.collapsible !== false && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggle(section.label)}
                    className="h-auto p-1 hover:bg-accent"
                  >
                    <ChevronDown
                      className={`h-2 w-2 transition-transform ${expanded[section.label] !== false ? "rotate-0" : "-rotate-90"}`}
                    />
                  </Button>
                )}
              </div>
            )}
            {section.collapsible === false || expanded[section.label] !== false ? (
              <SidebarGroupContent>
                {section.items && (
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url} className={getNavCls(item.url)}>
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span className="text-[12px]">{item.title}</span>}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                )}                 
              </SidebarGroupContent>
            ) : null}
            {section.label !== "Settings" && <Separator className="mx-4 mt-2" />}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        {!collapsed ? (
          <div className="p-4">
            <Button variant="outline" size="sm" className="w-full bg-brand-green text-white flex items-center gap-2">
              <Plus className="h-2 w-2" />
              Quick Add
            </Button>
          </div>
        ) : (
          <div className="p-2 flex justify-center">
            <Button variant="outline" size="sm" className="p-2">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
