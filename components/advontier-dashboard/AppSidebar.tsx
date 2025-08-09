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
import { useSidebar } from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const isActive = (path: string) => pathname === path
  const getNavCls = (path: string) =>
    isActive(path)
      ? "bg-gradient-to-l from-blue-300 to-slate-600 text-neutral-100 font-bold"
      : "text-neutral-900 hover:bg-blue-100 hover:text-blue-600"

  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <div className="flex flex-col h-full text-xs">
     

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="rounded-2xl m-2 bg-gradient-to-l from-white to-blue-50 text-blue-600 text-xs p-2">
          {sidebarSections.map((section) => (
            <div key={section.label} className="mb-4">
              {!collapsed && (
                <div className="flex items-center justify-between px-2 py-2 border-b-2 m-2 border-white">
                  <div className="text-slate-800 text-xs font-bold uppercase tracking-normal">
                    {section.label}
                  </div>
                  {section.collapsible !== false && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggle(section.label)}
                      className="h-auto p-1 hover:bg-blue-300 hover:text-blue-600"
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
                              <div className="flex items-center gap-2 px-2 py-2 mx-1 text-neutral-400 cursor-not-allowed">
                                {item.icon && <item.icon className="h-4 w-4" />}
                                {!collapsed && (
                                  <span className="text-xs">{item.title}</span>
                                )}
                                {!collapsed && (
                                  <Badge variant="secondary" className="ml-auto text-xs">
                                    {status === "locked" ? "🔒" : "🛡️"}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <Link
                                href={item.url || "#"}
                                className={clsx(
                                  "flex items-center gap-2 px-2 py-2 rounded-md transition-colors mx-1",
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
      <div className="p-4 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between ">
            <div className="text-xs text-white">
              <div className="font-medium">Advontier</div>
              <div className="text-blue-400">v2.0.0</div>
            </div>
            <Button variant="default" size="sm" className="h-8 w-8 p-0">
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
