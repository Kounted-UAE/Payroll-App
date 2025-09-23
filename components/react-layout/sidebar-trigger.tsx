'use client'

import * as React from "react"
import { KountedLogo } from '@/lib/assets/logos/KountedLogo'
import { cn } from "@/lib/utils"
import { Button } from "@/components/react-ui/button"
import { useSidebar } from "./sidebar-context"

export const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <KountedLogo className="h-6 w-6 bg-white/90 p-1 rounded-xs" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger" 