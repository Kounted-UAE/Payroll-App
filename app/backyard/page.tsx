// app/backyard/page.tsx

'use client'

import { useState, Fragment } from "react"
import {
  Dialog,
  Transition,
} from "@headlessui/react"
import {
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid"
import { sidebarSections } from "@/lib/config/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  ChartBar,
  FileText,
  Users,
  DollarSign,
  CheckSquare,
  Briefcase,
  AppWindowIcon,
  Settings,
  BarChart3,
} from "lucide-react"
import DashboardEntityStats from '@/components/backyard/DashboardEntityStats'
import DashboardKPICards from '@/components/backyard/DashboardKPICards'
import type { KPI } from "@/components/backyard/DashboardKPICards"
import DashboardQuicklinks from '@/components/backyard/DashboardQuicklinks'

const metrics = [
  { label: "Active Customers", count: 128, description: "Companies with ongoing engagement", link: "/backyard/clients" },
  { label: "Kwiver Retainers", count: 62, description: "Ongoing fractional support agreements", link: "#" },
  { label: "Kwiver Quotes", count: 21, description: "Once-off or ad hoc engagement types", link: "#" },
  { label: "Corporate Profiles", count: 434, description: "Incorporated entities on file", link: "#" },
  { label: "Personal Profiles", count: 85, description: "Verified private individuals in CRM", link: "#" },
  { label: "Visas", count: 55, description: "Active and historical visa records", link: "#" },
  { label: "Trade Licensess", count: 23, description: "Valid business licenses across zones", link: "#" },
]

const kpiStats: KPI[] = [
  { kpi_id: 1, name: 'Total Revenue (YTD)', stat: 'AED 1.2M', previousStat: 'AED 950K', change: '26%', changeType: 'increase' },
  { kpi_id: 2, name: 'Sales Offers Issued', stat: '312', previousStat: '280', change: '11%', changeType: 'increase' },
  { kpi_id: 3, name: 'Payroll Processed', stat: 'AED 3.4M', previousStat: 'AED 2.9M', change: '17%', changeType: 'increase' },
]

function groupRoadmap(sections: any) {
  const active: any[] = []
  const comingSoon: any[] = []
  sections.forEach(section => {
    section.items?.forEach(item => {
      if (!item.title) return
      const enriched = { ...item, section: section.label }
      item.status === "active" ? active.push(enriched) : comingSoon.push(enriched)
    })
  })
  return { active, comingSoon }
}


export default function DashboardHome() {
  const [open, setOpen] = useState(false)
  const { active, comingSoon } = groupRoadmap(sidebarSections)

  return (
    <div className="bg-primary/10 rounded-t-2xl">

     {/* Quick Links Cards */}

  <section id="quicklinks">
      <div className="p-4 flex items-center justify-between py-2">
      <h1 className="text-xs font-semibold flex items-center gap-2 mb-1">
        <AppWindowIcon className="h-5 w-5 text-primary" />
        Quick Links
      </h1>
      <Button variant="ghost" onClick={() => setOpen(true)} className="">

<h1 className="text-md font-semibold flex items-center gap-2 mb-1">

  Platform Roadmap
  <MapPin className="h-5 w-5 text-primary" />
</h1>
</Button>
    </div>

      <DashboardQuicklinks />
      
      </section>

      {/* KPI Performance Cards */}
      <section id="performance">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xs font-semibold flex items-center gap-2 mb-1">
              <ChartBar className="h-5 w-5 text-primary" />
              Performance Overview
            </h1>
            <p className="text-xs text-muted-foreground">Key metrics and performance indicators</p>
          </div>
        </div>
        <DashboardKPICards kpis={kpiStats} />
      </section>

      {/* Entity Statistics */}
      <section id="entities">
        <div className="p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xs font-semibold flex items-center gap-2 mb-1">
              <Users className="h-5 w-5 text-primary" />
              Entity Statistics
            </h1>
            <p className="text-xs text-muted-foreground">Overview of all system entities</p>
          </div>
        </div>
        <DashboardEntityStats metrics={metrics} />
      </section>

      {/* Roadmap Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-foreground">
                            Platform Roadmap
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="space-y-6">
                          {/* Active Features */}
                          <div>
                            <h3 className="text-sm font-medium text-foreground mb-3">Active Features</h3>
                            <div className="space-y-2">
                              {active.map((item) => (
                                <div key={item.title} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border">
                                  <div className="flex items-center gap-3">
                                    {item.icon && <item.icon className="h-5 w-5 text-primary" />}
                                    <div>
                                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                                      <p className="text-xs text-muted-foreground">{item.section}</p>
                                    </div>
                                  </div>
                                  <Badge variant="default" className="text-xs">Active</Badge>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Coming Soon */}
                          <div>
                            <h3 className="text-sm font-medium text-foreground mb-3">Coming Soon</h3>
                            <div className="space-y-2">
                              {comingSoon.map((item) => (
                                <div key={item.title} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                                  <div className="flex items-center gap-3">
                                    {item.icon && <item.icon className="h-5 w-5 text-muted-foreground" />}
                                    <div>
                                      <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                                      <p className="text-xs text-muted-foreground">{item.section}</p>
                                    </div>
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    {item.status === "locked" ? "🔒 Locked" : "🚧 WIP"}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

function DropdownMenu({ deck }: { deck: any }) {
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
      {/* Simulated menu */}
      <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white focus:outline-none">
        <div className="py-1 text-xs">
          <button onClick={() => alert('View')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">View</button>
          <button onClick={handleInfo} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Info</button>
          <button onClick={handleLearn} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Learn More</button>
        </div>
      </div>
    </div>
  )
}
