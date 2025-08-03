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
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, Plus, HomeIcon } from "lucide-react"
import clsx from "clsx"
import { sidebarSections } from "@/lib/config/sidebar-nav"
import { KountedLabelLogoLight } from "@/lib/assets/KountedLabelLogo_01"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function AppSidebar() {
  const { state } = useSidebar()
  const pathname = usePathname()
  const collapsed = state === "collapsed"

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const isActive = (path: string) => pathname === path
  const getNavCls = (path: string) =>
    isActive(path)
      ? "mx-6 bg-gradient-to-r to-primary/70 from-primary/50 to-primary/10 text-primary-foreground font-bold"
      : "text-sidebar-foreground hover:bg-sidebar-accent"

  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <Sidebar
      collapsible="icon"
      className={clsx(
        "flex flex-col h-screen transition-all duration-300",
        collapsed ? "w-36 text-xs" : "w-64 text-xs"
      )}
    >
      {/* Sticky Header */}
      <SidebarHeader className="sticky top-0 z-100 h-24 border-b border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm">
        {!collapsed ? (
          <div className="flex items-center justify-center h-full px-4">
            <KountedLabelLogoLight className="h-16 w-full" />
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <HomeIcon className="h-8 w-8 text-sidebar-foreground bg-sidebar-primary/50 rounded-md p-2" />
          </div>
        )}
      </SidebarHeader>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <SidebarContent className="bg-sidebar text-sidebar-foreground text-xs">
          {sidebarSections.map((section) => (
            <SidebarGroup key={section.label}>
              {!collapsed && (
                <div className="flex items-center justify-between px-3 py-2">
                  <SidebarGroupLabel className="text-sidebar-primary text-xs font-semibold uppercase tracking-wide">
                    {section.label}
                  </SidebarGroupLabel>
                  {section.collapsible !== false && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggle(section.label)}
                      className="h-auto p-1 hover:bg-sidebar-accent"
                    >
                      <ChevronDown
                        className={clsx(
                          "h-2 w-2 transition-transform",
                          expanded[section.label] !== false ? "rotate-0" : "-rotate-90"
                        )}
                      />
                    </Button>
                  )}
                </div>
              )}
              {(section.collapsible === false || expanded[section.label] !== false) && (
                <SidebarGroupContent>
                  {section.items && (
                    <SidebarMenu>
                      {section.items.map((item) => {
                        const status = item.status || "active"
                        const isInactive = status === "locked" || status === "wip"
                        return (
                          <SidebarMenuItem key={item.title}>
                            {isInactive ? (
                              <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground cursor-not-allowed">
                                {item.icon && <item.icon className="h-4 w-4" />}
                                {!collapsed && (
                                  <span className="text-xs">{item.title}</span>
                                )}
                                {!collapsed && (
                                  <Badge variant="secondary" className="ml-auto text-xs">
                                    {status === "locked" ? "🔒" : "🚧"}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <SidebarMenuButton asChild>
                                <Link
                                  href={item.url || "#"}
                                  className={clsx(
                                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                                    getNavCls(item.url || "")
                                  )}
                                >
                                  {item.icon && <item.icon className="h-4 w-4" />}
                                  {!collapsed && (
                                    <span className="text-xs">{item.title}</span>
                                  )}

                                </Link>
                              </SidebarMenuButton>
                            )}
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  )}
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          ))}
        </SidebarContent>
      </ScrollArea>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="text-xs text-sidebar-foreground">
              <div className="font-medium">Advontier</div>
              <div className="text-muted-foreground">v2.0.0</div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
