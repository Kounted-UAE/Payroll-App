'use client'

import { RootLayout } from './layout/RootLayout'

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>
} 