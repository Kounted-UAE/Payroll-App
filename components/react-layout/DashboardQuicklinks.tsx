'use client'

import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { AppWindowIcon } from "lucide-react"
import { Badge } from "@/components/react-ui/badge"
import { clsx } from 'clsx'

const quicklinks = [
  { title: "Client Decks", initials: "CD", icon: null, members: 0, color: "bg-primary" },
  { title: "Sales Decks", initials: "SD", icon: null, members: 0, color: "bg-primary" },
  { title: "Service Decks", initials: "SV", icon: null, members: 0, color: "bg-primary" },
  { title: "Accounting Onboarding", initials: "SV", icon: null, members: 0, color: "bg-primary" },
  { title: "Payroll Apps", initials: "PR", icon: null, members: 6, color: "bg-primary" },
  { title: "Compliance Decks", initials: "XD", icon: null, members: 0, color: "bg-accent" },  
]

type Deck = {
  title: string
  initials: string
  icon: any
  members: number
  color: string
}

export default function DashboardQuicklinks() {
  return (
    <section id="quicklinks" className="px-6 py-0">  

      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6"
      >
        {quicklinks.map((quicklink) => (
          <li
            key={quicklink.title}
            className="col-span-1 flex rounded-md shadow-sm"
          >
            <div
              className={clsx(
                quicklink.color,
                'flex w-16 shrink-0 items-center justify-center rounded-l-md text-xs font-medium text-primary-foreground'
              )}
            >
              {quicklink.initials}
            </div>
            <div className="flex-1 flex items-center justify-between truncate rounded-r-md  bg-card">
              <div className="flex-1 truncate px-4 py-2 text-xs">
                <span className="font-medium text-card-foreground">{quicklink.title}</span>
                <p className="text-blue-400">{quicklink.members} Users Assigned</p>
              </div>
              <div className="shrink-0 pr-2">
                <DropdownMenu deck={quicklink} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function DropdownMenu({ deck }: { deck: Deck }) {
  const handleInfo = () => alert(`${deck.title}: A powerful deck for managing ${deck.members} records.`)
  const handleLearn = () => console.log(`Learn more about ${deck.title}`)

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex size-8 items-center justify-center rounded-full text-blue-200 hover:text-foreground focus:outline-none"
      >
        <EllipsisVerticalIcon className="h-4 w-4" />
        <span className="sr-only">Open options</span>
      </button>
      <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-popover focus:outline-none">
        <div className="py-1 text-xs">
          <button onClick={() => alert('View')} className="block w-full text-left px-4 py-2 text-popover-foreground hover:bg-accent">View</button>
          <button onClick={handleInfo} className="block w-full text-left px-4 py-2 text-popover-foreground hover:bg-accent">Info</button>
          <button onClick={handleLearn} className="block w-full text-left px-4 py-2 text-popover-foreground hover:bg-accent">Learn More</button>
        </div>
      </div>
    </div>
  )
}
