// components/web-ui/AdvontierFooter.tsx

'use client'

import Link from 'next/link'
import { useMemo } from 'react'

export default function MarketingFooter() {  
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <footer className="w-full bg-zinc-900 border-t border-blue-300">      
      <div className="flex max-w-7xl items-center px-2 py-1 text-[8px] flex-col justify-center">
        <Link
          href="https://advontier.com"
          target="_blank"                
          rel="noopener noreferrer"
          className="font-semibold hover:underline"
        >
          <span className="text-zinc-100">powered by </span>
          <span className="text-blue-300">advontier</span>
          <span className="text-blue-400">.</span>
          <span className="text-zinc-100">com</span>
          <span className="text-blue-300"> - digital transformation solutions</span>
        </Link>{' '}

        <div className="shrink-0">  </div>
      </div>

    </footer>
  )
}
