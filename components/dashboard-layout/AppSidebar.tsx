'use client'

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, Plus, HomeIcon } from "lucide-react"
import clsx from "clsx"
import { sidebarSections } from "@/lib/config/sidebar-nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const isActive = (path: string) => pathname === path
  const getNavCls = (path: string) =>
    isActive(path)
      ? "mx-6 bg-gradient-to-r to-primary/70 from-primary/50 to-primary/10 text-primary-foreground font-bold"
      : "text-sidebar-foreground hover:bg-sidebar-accent"

  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <div className={clsx(
      "flex flex-col h-full transition-all duration-300 bg-sidebar",
      collapsed ? "w-36 text-xs" : "w-64 text-xs"
    )}>
     

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="bg-sidebar text-sidebar-foreground text-xs p-2">
          {sidebarSections.map((section) => (
            <div key={section.label} className="mb-4">
              {!collapsed && (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-sidebar-primary text-xs font-semibold uppercase tracking-wide">
                    {section.label}
                  </div>
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
                <div>
                  {section.items && (
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const status = item.status || "active"
                        const isInactive = status === "locked" || status === "wip"
                        return (
                          <div key={item.title}>
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
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 flex-shrink-0">
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
      </div>
    </div>
  )
}
