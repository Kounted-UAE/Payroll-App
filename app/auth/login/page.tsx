'use client'

import Image from 'next/image'
import LoginForm from '@/components/auth/login-form'
import LoginNotice from '@/components/auth/login-notice'

export default function LoginPage() {
  return (
<section className="relative min-h-screen flex flex-col lg:flex-row bg-brand-charcoal text-foreground">
  {/* Background pattern */}
  <div className="absolute inset-0 -z-10">
    <Image
      src="/backgrounds/kounted_bg_charcoal.webp"
      alt="Kounted Background"
      fill
      className="object-cover opacity-10"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent" />
  </div>

 
  {/* Left: Login form with similar card treatment */}
  <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
      <LoginForm />
    </div>
  </div>

   {/* Right: Notice board with subtle blur and border */}
   <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md bg-white/5 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl">
      <LoginNotice />
    </div>
  </div>

</section>

  )
}
