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
      <Container className="items-center justify-center flex flex-col mt-20 sm:mt-24 md:mt-32">
        <FadeIn className="font-display">
          <h1 className="font-display text-xl font-medium tracking-tight text-balance sm:text-6xl">
  Sign in to Advontier Practice Manager
</h1>
<p className="mt-6 text-md text-neutral-600">
  Secure portal for UAE accountants and advisors. Access client records, compliance calendars, payroll, and more.
</p>

        </FadeIn>
      </Container>
         
      
      {/* Login Section */}
      <Container className="mt-8 sm:mt-12 lg:mt-16">
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
