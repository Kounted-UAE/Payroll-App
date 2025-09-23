'use client'

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/react-ui/button"
import { Separator } from "@/components/react-ui/separator"
import { ChevronDown, Plus, HomeIcon } from "lucide-react"
import clsx from "clsx"
import { sidebarSections } from "@/lib/config/sidebar-nav"
import { ScrollArea } from "@/components/react-ui/scroll-area"
import { Badge } from "@/components/react-ui/badge"
import { useSidebar } from "./sidebar-context"

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})

  const isActive = (path: string) => pathname === path
  const getNavCls = (path: string) =>
    isActive(path)
      ? "text-neutral-700 bg-zinc-100 font-bold"
      : "text-neutral-200 hover:bg-zinc-100 hover:text-slate-400"

  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <div className="flex flex-col h-full text-xs">
     

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className=" bg-slate-900 p-1">
          {sidebarSections.map((section) => (
            <div key={section.label} className="mb-4">
              {!collapsed && (
                <div className="flex items-center justify-between px-2 py-2 border-b-1 m-2 border-zinc-400/50">
                  <div className="text-zinc-300 text-xs font-bold uppercase tracking-normal">
                    {section.label}
                  </div>
                  {section.collapsible !== true && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggle(section.label)}
                      className="h-auto p-1 hover:bg-zinc-300 hover:text-zinc-600"
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
                              <div className={clsx(
                                "flex items-center py-2 mx-1 text-zinc-300/50 cursor-not-allowed",
                                collapsed ? "justify-center px-0" : "gap-2 px-2"
                              )}>
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
                                  "flex items-center py-2 rounded-md transition-colors mx-1",
                                  collapsed ? "justify-center px-0" : "gap-2 px-2",
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
            <div className="text-xs text-slate-800">
              <div className="font-medium">kounted</div>
              <div className="text-zinc-600">v2.0.0</div>
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
