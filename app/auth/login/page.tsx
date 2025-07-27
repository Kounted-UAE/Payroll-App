// app/auth/login/page.tsx

'use client'

import Image from 'next/image'
import LoginForm from '@/components/auth/login-form'
import LoginNotice from '@/components/auth/login-notice'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-4 py-4">
      
       {/* Background pattern */}
       <div className="absolute inset-0 -z-10 overflow-hidden  bg-zinc-900">
        <Image
          src="/backgrounds/kounted_bg_charcoal.webp"
          alt="Dark background"
          fill
          className="object-cover opacity-10 block "
          priority
        />
      </div>



      {/* Hero */}
      <section className='mx-auto max-w-7xl relative flex items-center justify-between mt-8 px-4'>
      <div className='text-center w-full '>
      <Image
          src="/logos/kounted_logo_text_light.webp"
          alt="Kounted Logo"
          width={240}
          height={60}
          className="mx-auto py-2"
        />
          <h2 className=" max-w-3xl text-4xl mt-4 font-medium tracking-tight leading-tight text-white">
                     We take <span className="text-lime-600">complete ownership</span> of our client's compliance and operational requirements.
          </h2>
          <br />        
        
      </div>
    </section>

      {/* Form */}
      <div className="w-full max-w-md mt-2 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl z-10">
        <LoginForm />
      </div>

      {/* Notice */}
      <div className="w-full max-w-md mt-2 backdrop-blur-sm">
        <LoginNotice />
      </div>
    </div>
  )
}
