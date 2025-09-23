// app/layout.tsx

import type { Metadata } from "next"
import type React from "react"
import { AppProviders } from './providers'
import { Inter } from "next/font/google";
import Script from "next/script"
import  AuthProvider  from "@/components/auth/auth-provider"
import { Toaster } from "@/components/react-ui/sonner"
import { CookieConsentBanner } from "@/components/react-ui/cookie-consent"

import { cn } from "@/lib/utils"

import "@/lib/styles/tailwind.css"

const inter = Inter({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  display: "swap" 
});


export const metadata: Metadata = {
  title: "kounted Digital Solutions",
  description: "A Central Business Suite for UAE Accounting Practices",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
    lang="en"
    className={cn(inter.variable)}
    suppressHydrationWarning
  >
      <head>
     
      </head>
      <body className={cn("min-h-screen bg-white antialiased")}>
        <AppProviders>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
          <CookieConsentBanner />
        </AppProviders>
      </body>
    </html>
  )
}
