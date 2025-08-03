// app/auth/login/page.tsx

'use client'

import Image from 'next/image'
import LoginForm from '@/components/auth/login-form'
import LoginNotice from '@/components/auth/login-notice'
import { Logo } from '@/components/advontier-ui/Logo'
import { Container } from '@/components/advontier-ui/Container'
import { FadeIn } from '@/components/advontier-ui/FadeIn'
import { RootLayout } from '@/components/advontier-ui/RootLayout'

export default function LoginPage() {
  return (
    <RootLayout>
      <Container className="mt-20 sm:mt-24 md:mt-32">
        <FadeIn className="max-w-3xl font-display">
          <h1 className="font-display text-xl font-medium tracking-tight text-balance sm:text-7xl">
            If you're an accountant in the UAE, you're in the right place
          </h1>
          <p className="mt-6 text-md text-neutral-600">
            Login to our practice management platform to access client data, compliance calendars, and more...
          </p>
        </FadeIn>
      </Container>
         
      
      {/* Login Section */}
      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <div className="flex flex-col items-center justify-center mx-auto">
              
          <FadeIn >
            <div className="w-full m-12 flex gap-24 flex-col-2 items-center justify-center">
          
             <LoginForm />
             <LoginNotice />
            </div>
          </FadeIn>

        </div>
      </Container>
    </RootLayout>
  )
}
