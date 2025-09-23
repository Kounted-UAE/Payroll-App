'use client'

import React, { useId } from 'react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'

interface Tab {
  name: string
  value: string
}

interface ActionButton {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

interface XeroTabSectionHeaderProps {
  title: string
  tabs: Tab[]
  activeTab: string
  onTabChange: (value: string) => void
  actions?: ActionButton[]
}

export default function XeroTabSectionHeader({
  title,
  tabs,
  activeTab,
  onTabChange,
  actions = [],
}: XeroTabSectionHeaderProps) {
  const selectId = useId()

  return (
    <div className="relative border-b border-muted pb-4 sm:pb-0">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <div className="mt-3 flex gap-2 md:absolute md:top-3 md:right-0 md:mt-0">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              type="button"
              className={
                action.variant === 'secondary'
                  ? 'inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-foreground shadow-sm ring-1 ring-muted hover:bg-zinc-100/50'
                  : 'inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500'
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile select */}
      <div className="mt-4 grid grid-cols-1 sm:hidden relative">
        <select
          id={selectId}
          defaultValue={activeTab}
          onChange={(e) => onTabChange(e.target.value)}
          className="appearance-none rounded-md bg-white border px-3 py-2 text-base text-foreground focus:outline focus:outline-ring"
        >
          {tabs.map((tab) => (
            <option key={tab.value} value={tab.value}>
              {tab.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
          aria-hidden="true"
        />
      </div>

      {/* Desktop nav */}
      <div className="hidden sm:block mt-4">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`border-b-2 px-1 pb-2 text-sm font-medium whitespace-nowrap ${
                tab.value === activeTab
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-zinc-400 hover:border-muted hover:text-foreground'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
