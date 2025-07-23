'use client'

import Image from 'next/image'
import LoginForm from '@/components/auth/login-form'
import LoginNotice from '@/components/auth/login-notice'

export default function LoginPage() {
  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/backgrounds/kounted_bg_charcoal.webp"
          alt="Kounted Background"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      {/* Left: Notice board */}
      <div className="w-full lg:w-1/2 flex items-center justify-start px-4 py-12">
        <LoginNotice />
      </div>

      {/* Right: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        <LoginForm />
      </div>
    </section>
  )
}
