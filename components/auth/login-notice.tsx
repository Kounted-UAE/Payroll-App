'use client'

import { CheckCircle } from 'lucide-react'

export default function LoginNotice() {
  return (
    <div className="h-full w-full max-w-2xl mx-auto px-4 py-2 flex flex-col justify-center text-white">
      {/* Kounted Features */}
      <div>
        <h2 className="text-lg font-semibold text-brand-light mb-3">
          Features
        </h2>
        <ul className="space-y-3 text-sm text-brand-light">
          {[
            { label: 'Payroll Processing', status: 'Live' },
            { label: 'KORP Kiosk', status: 'Coming soon' },
            { label: 'KWAY CPQ', status: 'Coming soon' },
            { label: 'Compliance Tools', status: 'Coming soon' },
            { label: 'Client Onboarding', status: 'Coming soon' },
            { label: 'Kounted CRM', status: 'Coming soon' },
            { label: 'Knowledge Base', status: 'Coming soon' },            
            
          ].map(({ label, status }) => (
            <li key={label} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-brand-lime shrink-0" />
              <span>{label}</span>
              <span className="ml-auto text-xs font-medium text-right rounded px-2 py-0.5">
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
  )
}
