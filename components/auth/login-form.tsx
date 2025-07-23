// components/auth/login-form.tsx

'use client'

import Image from 'next/image'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithOTP, verifyOTP } from '@/lib/auth/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, ArrowRight, Mail } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [showOTPInput, setShowOTPInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: otpError } = await signInWithOTP(email)
    if (otpError) setError(otpError.message)
    else setShowOTPInput(true)
    setLoading(false)
  }

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { user, session, error: authError } = await verifyOTP(email, otpToken)
    if (authError) setError(authError.message)
    else if (user && session) {
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => router.push('/dashboard'), 1000)
    }
    setLoading(false)
  }

  const resetOTPFlow = () => {
    setShowOTPInput(false)
    setOtpToken('')
    setSuccess(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
       <Image
                  src="/logos/kounted_logo_text_light.webp"
                  alt="FTA Logo"
                  width={130}
                  height={30}
                  className="mt-1 py-2"
                />
        <h1 className="text-sm font-semibold text-brand-green">
          Sign In
        </h1>
        <p className="text-xs text-base text-white">
          Passwordless login. Enter your email to receive a one-time code. 
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {!showOTPInput ? (
        <form onSubmit={handleOTPLogin} className="space-y-4 bg-gradient-to-tr from-brand-charcoal to-brand-green/50 rounded-2xl p-6 shadow-xl">
          <Label htmlFor="email" className="text-xs text-brand-light">Submit Email Address</Label>
          <div className="relative">
            <Mail className="absolute text-xs left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10 bg-white text-black text-xs "
              required
            />
          </div>
          <Button type="submit" className="w-full bg-brand-green text-brand-dark text-xs" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP to Email'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-brand-light">We’ll send a 6-digit login code to your email.</p>
        </form>
      ) : (
        <form onSubmit={handleOTPVerification} className="space-y-4 bg-gradient-to-tr from-brand-charcoal to-brand-green/50 rounded-2xl p-6 shadow-xl">
          <Label htmlFor="otp" className="text-xs text-white">Enter OTP Code</Label>
          <Input
            id="otp"
            type="text"
            value={otpToken}
            onChange={(e) => setOtpToken(e.target.value)}
            placeholder="123456"
            className="text-center text-lg tracking-widest text-black bg-white"
            maxLength={6}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Sign In'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={resetOTPFlow} className="text-xs text-zinc-400">
            ← Back to email entry
          </Button>
        </form>
      )}
      <div className='text-xs'>Request support from: <span className='text-blue-400'>app-accounts@advontier.com</span> if needed.</div>
    </div>
  )
}
