'use client'

import { CheckCircle } from 'lucide-react'

export default function LoginNotice() {
  return (
    <div className="h-full w-full max-w-2xl mx-auto px-4 py-12 flex flex-col justify-center text-white">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs sm:text-sm font-semibold text-brand-green">
          Welcome to the sheet-show
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-pretty text-white">
          Our Backyard
        </h1>
        <p className="text-sm sm:text-base text-brand-light max-w-md mt-2">
          Your secure workspace for managing clients, workflows, documents, payroll, and compliance — all in one place.
        </p>
      </div>

      {/* Section: Decks and Features */}
      <div className="mt-10 space-y-6">
        {/* Airtable Decks */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">
            Airtable Workspace Decks
          </h2>
          <ul className="grid grid-cols-2 gap-y-2 text-sm text-brand-light">
            {[
              'Exec deck',
              'BD deck',
              'Talent deck',
              'Client deck',
              'KYC deck',
              'SLA deck',
              'KWAY deck',
              'Visa deck',
              'License deck',
              'Tax deck',
              'AWI dashboard',
              'Reports – clients',
              'Forms'
            ].map((label) => (
              <li key={label} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-green shrink-0" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Kounted Features */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">
            Kounted Business Suite
          </h2>
          <ul className="space-y-3 text-sm text-brand-light">
            {[
              { label: 'SPV compliance plans', status: 'Live' },
              { label: 'Client repository', status: 'Coming soon' },
              { label: 'AI case assistant', status: 'Coming soon' },
              { label: 'Payroll dashboard', status: 'Live' },
            ].map(({ label, status }) => (
              <li key={label} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-brand-green shrink-0" />
                <span>{label}</span>
                <span className="ml-auto text-xs font-medium text-right rounded px-2 py-0.5 bg-white/10">
                  {status === 'Live' ? (
                    <span className="text-green-400">Live</span>
                  ) : (
                    <span className="text-zinc-400">{status}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
