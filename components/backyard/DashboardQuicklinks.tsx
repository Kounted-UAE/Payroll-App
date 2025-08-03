'use client'

import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { AppWindowIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { clsx } from 'clsx'

const quicklinks = [
  { title: "Client Decks", initials: "CD", icon: null, members: 0, color: "bg-blue-600" },
  { title: "Sales Decks", initials: "SD", icon: null, members: 0, color: "bg-blue-600" },
  { title: "Service Decks", initials: "SV", icon: null, members: 0, color: "bg-blue-600" },
  { title: "Accounting Onboarding", initials: "SV", icon: null, members: 0, color: "bg-blue-600" },
  { title: "Payroll Apps", initials: "PR", icon: null, members: 6, color: "bg-blue-600" },
  { title: "Compliance Decks", initials: "XD", icon: null, members: 0, color: "bg-yellow-400" },  
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
                'flex w-16 shrink-0 items-center justify-center rounded-l-md text-xs font-medium text-white'
              )}
            >
              {quicklink.initials}
            </div>
            <div className="flex-1 flex items-center justify-between truncate rounded-r-md border border-zinc-200 bg-white">
              <div className="flex-1 truncate px-4 py-2 text-xs">
                <span className="font-medium text-gray-900">{quicklink.title}</span>
                <p className="text-gray-500">{quicklink.members} Users Assigned</p>
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
        className="inline-flex size-8 items-center justify-center rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
        <span className="sr-only">Open options</span>
      </button>
      <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1 text-xs">
          <button onClick={() => alert('View')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">View</button>
          <button onClick={handleInfo} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Info</button>
          <button onClick={handleLearn} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Learn More</button>
        </div>
      </div>
    </div>
  )
}
