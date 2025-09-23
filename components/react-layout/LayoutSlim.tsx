'use client'

import Image from 'next/image'

export function SlimLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative flex min-h-full shrink-0 justify-center md:px-12 lg:px-0">
        <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-28">
        <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
        <div className="text-left">
            {children}
          </div>
          </main>
        </div>
        <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/images/backgrounds/kounted_bg_green.webp"
            width="1920"
            height="1080"
            alt=""
            unoptimized
          />
        </div>
      </div>
    </>
  )
}
