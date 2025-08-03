'use client'

import { CheckCircle, Circle } from 'lucide-react'
import { Logomark } from '../advontier-ui/Logo'

const features = [
  { label: 'Payroll Processing', status: 'Live' },
  { label: 'Compliance Tools', status: 'Coming soon' },
  { label: 'Client Onboarding', status: 'Coming soon' },
  { label: 'On-Demand Service Ordering', status: 'Coming soon' },
  { label: 'Comprehensive Retainer Configuration', status: 'Coming soon' },
  { label: 'Client Portal', status: 'Coming soon' },
  { label: 'Knowledge Base', status: 'Coming soon' },
  { label: 'Accounting CRM', status: 'Coming soon' },
]

export default function LoginNotice() {
  return (
    <div className="w-full max-w-md mx-auto bg-zinc-50 border border-zinc-100 rounded-2xl px-8 py-8 flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-blue-600 mb-2 tracking-tight text-center">
        Advontier Feature Rollout
      </h2>
      <ul className="space-y-3 text-sm">
        {features.map(({ label, status }) => (
          <li key={label} className="flex items-center gap-2">
            {status === 'Live' ? (
              <CheckCircle className="h-4 w-4 text-blue-500" />
            ) : (
              <Circle className="h-4 w-4 text-zinc-300" />
            )}
            <span className="text-zinc-700">{label}</span>
            <span className="ml-auto text-xs font-medium rounded px-2 py-0.5">
              {status === 'Live' ? (
                <span className="text-blue-500 bg-blue-50 px-2 rounded font-semibold">Live</span>
              ) : (
                <span className="text-zinc-400">{status}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex justify-end pt-4">
        <Logomark className="h-6 w-6 text-blue-500" />
      </div>
    </div>
  )
}
