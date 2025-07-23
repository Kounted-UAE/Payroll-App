// components/auth/login-notice.tsx

'use client'

import { CheckCircle } from 'lucide-react'


export default function LoginNotice() {
  return (
    <div className="h-full w-full py-12 px-2 flex flex-col justify-center text-white">
      <p className="text-xs sm:text-sm font-semibold text-brand-green">
        Welcome to the sheet-show
      </p>

      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl sm:text-balance">
        Our Backyard
      </h1>

      <p className="mt-4 text-sm text-brand-light max-w-md">
        Your secure workspace for managing clients, workflows, documents, payroll, and compliance — all in one place.
      </p>

      <h2 className="mt-6 text-xl font-semibold tracking-tight text-white sm:text-balance">
        Dedicated Decks and Dashboards
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-1 text-xs">
  {/* Airtable Workspace Decks */}
        <div>
          <h3 className="text-sm font-semibold text-brand-green mb-2">
            Airtable Workspace
          </h3>
          <ul className="space-y-2 text-brand-light">
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
              <li key={label} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-brand-green" />
                {label}
              </li>
            ))}
          </ul>
        </div>
                {/* Kounted Business Suite Features */}
        <div>
          <h3 className="text-sm font-semibold text-brand-green mb-2">
            Kounted Business Suite
          </h3>
          <ul className="space-y-2 text-brand-light">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-brand-green" />
              SPV compliance plans
              <span className="ml-auto text-green-400 font-medium">Live</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-brand-green" />
              Client repository
              <span className="ml-auto text-zinc-400">Coming soon</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-brand-green" />
              AI case assistant
              <span className="ml-auto text-zinc-400">Coming soon</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-brand-green" />
              Payroll dashboard
              <span className="ml-auto text-green-400 font-medium">Live</span>
            </li>
          </ul>
        </div>

      
      </div>
    </div>
  )
}
