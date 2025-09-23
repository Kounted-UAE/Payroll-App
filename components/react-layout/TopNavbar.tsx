// components/kounted-dashboard/TopNavbar.tsx
'use client'

import { Bell, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/react-ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/react-ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/react-ui/avatar"
import { useSidebar } from "./sidebar-context"
import { KountedLogo } from '@/lib/assets/logos/KountedLogo'

export function TopNavbar() {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <header className="text-sm h-20 bg-slate-900 shadow-sm backdrop-blur overflow-hidden w-full">
      <div className="h-full flex items-center justify-between px-2 relative z-10  text-white font-bold">
        {/* Left side - KountedLogo */}
        <div className="flex items-center">
          {collapsed ? (
            <KountedLogo variant="dark" className="h-10 w-10 flex-shrink-0" />
          ) : (
            <KountedLogo variant="light" className="h-10 w-30 flex-shrink-0" />
          )}
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
          </Button>

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
                  <p className="text-xs leading-none text-zinc-400">kevin@kounted.ae</p>
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
                <LogOut className="mr-2 h-4 w-4"/>
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
