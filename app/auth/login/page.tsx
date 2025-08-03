// app/auth/login/page.tsx

'use client'

import Image from 'next/image'
import LoginForm from '@/components/auth/login-form'
import { Logo } from '@/components/advontier-ui/Logo'
import { Container } from '@/components/advontier-ui/Container'
import { FadeIn } from '@/components/advontier-ui/FadeIn'
import { RootLayout } from '@/components/advontier-ui/RootLayout'

export default function LoginPage() {
  return (
    <RootLayout>
      <Container className="mt-4 sm:mt-8 lg:mt-16">
        <div className="flex flex-col items-center justify-center mx-auto min-h-screen py-4 sm:py-8">
          <FadeIn>
            <div className="w-full max-w-md mx-auto px-4 sm:px-0">
              <LoginForm />
            </div>
          </FadeIn>
        </div>
      </Container>
    </RootLayout>
  )
}
