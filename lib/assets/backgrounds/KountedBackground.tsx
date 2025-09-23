'use client'

import Image from 'next/image'

export function KountedBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {/* Light mode pattern */}
      <Image
        src="/practical/kounted-gradient-pattern-light.webp"
        alt="Background pattern light"
        fill
        className="object-cover dark:hidden"
        priority
      />
      {/* Dark mode pattern */}
      <Image
        src="/practical/kounted-gradient-pattern-dark.webp"
        alt="Background pattern dark"
        fill
        className="object-cover opacity-30 hidden dark:block"
        priority
      />
    </div>
  )
}