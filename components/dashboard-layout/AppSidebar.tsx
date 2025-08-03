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

export function AppSidebar() {
  const { state } = useSidebar()
  const pathname = usePathname()
  const collapsed = state === "collapsed"

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const isActive = (path: string) => pathname === path
  const getNavCls = (path: string) =>
    isActive(path)
      ? "mx-6 bg-gradient-to-r to-blue-500/70 from-blue-500/50 to-blue-500/10 text-white font-bold"
      : "text-zinc-700 hover:bg-zinc-100"

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
      <SidebarHeader className="sticky top-0 z-100 h-24 border-b border-border bg-gradient-to-r from-[#022000] to-[#020000] text-zinc-100 shadow-sm">
        {!collapsed ? (
          <div className="flex items-center justify-center h-full px-4">
            <KountedLabelLogoLight className="h-16 w-full" />
          </div>
        ) : (
          <div className="h-full flex justify-center items-center">
            <HomeIcon className="h-8 w-8 text-zinc-100 bg-blue-500/50 rounded-md p-2" />
          </div>
        )}
      </SidebarHeader>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <SidebarContent className="bg-zinc-100 text-zinc-700 text-xs">
          {sidebarSections.map((section) => (
            <SidebarGroup key={section.label}>
              {!collapsed && (
                <div className="flex items-center justify-between px-3 py-2">
                  <SidebarGroupLabel className="text-blue-500 text-xs font-semibold uppercase tracking-wide">
                    {section.label}
                  </SidebarGroupLabel>
                  {section.collapsible !== false && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggle(section.label)}
                      className="h-auto p-1 hover:bg-zinc-700"
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
              {section.collapsible === false || expanded[section.label] !== false ? (
                <SidebarGroupContent>
                  {section.items && (
                    <SidebarMenu>
                      {section.items.map((item) => {
                        const status = item.status || "active"
                        const isInactive = status === "locked" || status === "wip"
                        return (
                          <SidebarMenuItem key={item.title}>
                            {isInactive ? (
                              <div className="flex items-center px-3 py-1.5 opacity-70 italic text-zinc-400 cursor-not-allowed select-none">
                                <item.icon className="h-6 w-6 bg-zinc-400 text-blue-100 rounded-full p-1 flex-shrink-0" />

                                {!collapsed && (
                                  <>
                                    <span className="ml-2">{item.title}</span>
                                    <span className="ml-auto bg-zinc-300 text-zinc-700 rounded px-2 py-0.5 text-xs">
                                      {status === "locked" ? "Locked" : "Coming Soon"}
                                    </span>
                                  </>
                                )}
                              </div>
                            ) : (
                              <SidebarMenuButton asChild>
                                <Link
                                  href={item.url}
                                  className={clsx(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
                                    getNavCls(item.url)
                                  )}
                                >
                                  <item.icon className="h-5 w-5 min-w-7 min-h-7 bg-blue-500 text-blue-100 rounded-full p-2 flex-shrink-0" />



                                  {!collapsed && <span>{item.title}</span>}
                                </Link>
                              </SidebarMenuButton>
                            )}
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  )}
                </SidebarGroupContent>
              ) : null}
              {section.label !== "Settings" && <Separator className="my-2" />}
            </SidebarGroup>
          ))}
        </SidebarContent>
      </ScrollArea>

      {/* Footer */}
      <SidebarFooter className="border-t border-border bg-zinc-50">
        {!collapsed ? (
          <div className="p-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-blue-500 text-white flex items-center gap-2"
            >
              <Plus className="h-3 w-3" />
              Quick Add
            </Button>
          </div>
        ) : (
          <div className="p-2 flex justify-center">
            <Button variant="outline" size="sm" className="bg-blue-500 text-white">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
