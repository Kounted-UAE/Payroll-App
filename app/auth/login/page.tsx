// app/auth/login/page.tsx

'use client'

import LoginForm from '@/components/auth/login-form'
import { Container } from '@/components/react-layout/Container'
import { FadeIn } from '@/components/react-layout/FadeIn'
import { RootLayout } from '@/components/react-layout/RootLayout'

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
