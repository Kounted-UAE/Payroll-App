'use client'

import Image from 'next/image'

export function KountedBackgroundGreen() {
  return (
    <div className="absolute inset-0 z-0 bg-neutral-900 pointer-events-none">
      <Image
        src="/kounted-gradient-pattern-green.webp"
        alt="Background pattern"
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}