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
  { label: "KWAY Retainers", count: 62, description: "Ongoing fractional support agreements", link: "#" },
  { label: "KORP Retainers", count: 21, description: "Modular or ad hoc engagement types", link: "#" },
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

function groupRoadmap(sections) {
  const active = []
  const comingSoon = []
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
    <div className=" bg-transparent rounded-t-2xl">

     {/* Quick Links Cards */}

  <section id="quicklinks">
      <div className="p-4 flex items-center justify-between py-2">
      <h1 className="text-xs font-semibold flex items-center gap-2 mb-1">
        <AppWindowIcon className="h-5 w-5 text-blue-500" />
        Quick Links
      </h1>
      <Button variant="ghost" onClick={() => setOpen(true)} className="">

<h1 className="text-md font-semibold flex items-center gap-2 mb-1">

  Platform Roadmap
  <MapPin className="h-5 w-5 text-blue-500" />
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
              <ChartBar className="h-5 w-5 text-blue-500" />
              Performance Overview
            </h1>
          </div>
         
        </div>
        <DashboardKPICards stats={kpiStats} />
      </section>

 

      {/* Object Summary Cards */}
      <section id="records">
      <div className="p-4 flex items-center justify-between py-12">
      <h1 className="text-xs font-semibold flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5 text-blue-500" />
            Managed Records
          </h1>
          </div>
        <DashboardEntityStats metrics={metrics} />
      </section>
      
    

      {/* Slideout Drawer */}
      <Transition show={open} as={Fragment}>
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
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md bg-white shadow-xl">
                    <div className="flex h-full flex-col divide-y divide-gray-200">
                      <img src="/images/Tour de Backyard_ Champion in Yellow.JPEG" alt="Backyard Logo" className="w-full" />
                      <div className="flex items-center justify-between px-6 py-4 bg-yellow-300">
                        <Dialog.Title className="rounded-2xl p-2 bg-yellow-500 text-xs font-medium text-gray-900 flex items-center gap-2">
                          <p className="text-xs">🚴🏻💨...</p>
                          <p className="text-xs font-bold text-yellow-50 font-italic">Development Roadmap</p>
                        </Dialog.Title>
                        <button
                          type="button"
                          className="text-yellow-800 bg-yellow-100 p-2 rounded-full hover:text-gray-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close</span>
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Coming Soon */}
                        <div>
                          <h4 className="text-xs font-semibold text-yellow-700 mb-2">...stages ahead 🚧 🚴🏻</h4>
                          <ul className="space-y-2">
                            {comingSoon.map(item => (
                              <li key={item.title} className="flex items-center text-xs gap-2 italic opacity-90">
                                <item.icon className="h-4 w-4 text-yellow-600" />
                                <span>{item.title}</span>
                                <Badge className="ml-auto text-xs bg-yellow-100 text-yellow-700">{item.section}</Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Work in Progress */}
                        <div>
                          <h4 className="text-xs font-semibold text-blue-700 mb-2">✅ Routes in progress</h4>
                          <ul className="space-y-2">
                            {active.map(item => (
                              <li key={item.title} className="flex items-center text-xs gap-2">
                                <item.icon className="h-4 w-4 text-blue-500" />
                                <span>{item.title}</span>
                                <Badge className="ml-auto text-xs bg-blue-100 text-blue-700">{item.section}</Badge>
                              </li>
                            ))}
                          </ul>

                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
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
