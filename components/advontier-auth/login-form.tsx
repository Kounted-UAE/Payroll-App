'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithOTP, verifyOTP } from '@/lib/supabase/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Circle,AlertCircle, ArrowRight, Mail } from 'lucide-react'
import { Logo, LogoMark } from '@/components/advontier-website/Logo'
import { FadeIn } from '../advontier-website/FadeIn'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [showOTPInput, setShowOTPInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)


  const features = [
    { label: 'Payroll Processing', status: 'Live' },
    { label: 'Compliance Tools', status: 'Coming soon' },
    { label: 'Client Onboarding', status: 'Coming soon' },
    { label: 'On-Demand Service Ordering', status: 'Coming soon' },
    { label: 'Comprehensive Retainer Configuration', status: 'Coming soon' },
    { label: 'Client Portal', status: 'Coming soon' },
    { label: 'Knowledge Base', status: 'Coming soon' },
    { label: 'Accounting CRM', status: 'Coming soon' },
  ]
  

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
      setTimeout(() => router.push('/advontier'), 1000)
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
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-6 sm:gap-8">
      {/* Header */}
      <FadeIn className="font-display">
        <h1 className="font-display text-2xl font-medium tracking-tight text-balance sm:text-4xl">
          Sign in to our prototype
        </h1>
        <p className="mt-4 sm:mt-6 text-sm sm:text-md text-neutral-600">
          A prototype for firms and independent advisors. Access client records, compliance calendars, payroll, and more.
        </p>
      </FadeIn>

      {/* Alert messages */}
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

      {/* Email form or OTP form */}
      {!showOTPInput ? (
        <form onSubmit={handleOTPLogin} className="space-y-4 sm:space-y-5">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm sm:text-base text-neutral-900 font-medium">
              Registered Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourfirm.ae"
                className="pl-10 bg-white text-neutral-900 ring-1 ring-zinc-200 focus:ring-blue-500"
                required
                autoFocus
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-sm"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send login code'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-start text-xs text-zinc-400">
            We'll email you a secure 6-digit code.
          </p>
        </form>
      ) : (
        <form onSubmit={handleOTPVerification} className="space-y-4 sm:space-y-5">
          <div className="space-y-1">
            <Label htmlFor="otp" className="text-sm sm:text-base text-neutral-900 font-medium">
              Enter your 6-digit code
            </Label>
            <Input
              id="otp"
              type="text"
              value={otpToken}
              onChange={(e) => setOtpToken(e.target.value)}
              placeholder="123456"
              className="text-center text-base tracking-widest text-neutral-900 bg-white ring-1 ring-zinc-200 focus:ring-blue-500"
              maxLength={6}
              required
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-xl shadow-sm"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Sign In'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={resetOTPFlow}
            className="text-xs text-zinc-400 w-full mt-1"
          >
            ← Back to email entry
          </Button>
        </form>
      )}

      {/* Support info */}
      <p className="text-center text-xs text-zinc-400 mt-2">
        Need help?{' '}
        <a 
          href="mailto:info@advontier.com" 
          className="text-blue-500 underline hover:text-blue-600"
        >
          Contact support
        </a>
      </p>

      {/* Feature Rollout - Hidden on mobile, shown on larger screens */}
      <div className="w-full max-w-2xl mx-auto bg-zinc-100 rounded-2xl px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-4 sm:gap-6">
        <h2 className="text-base sm:text-lg font-semibold text-blue-600 mb-2 tracking-tight text-center">
          Advontier Feature Rollout
        </h2>
        <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          {features.map(({ label, status }) => (
            <li key={label} className="flex items-center gap-2">
              {status === 'Live' ? (
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              ) : (
                <Circle className="h-3 w-3 sm:h-4 sm:w-4 text-zinc-300" />
              )}
              <span className="text-zinc-700 flex-1">{label}</span>
              <span className="text-xs font-medium rounded px-2 py-0.5">
                {status === 'Live' ? (
                  <span className="text-blue-500 bg-blue-50 px-2 rounded font-semibold">Live</span>
                ) : (
                  <span className="text-zinc-400">{status}</span>
                )}
              </span>
            </li>
          ))}
        </ul>        
      </div>
    </div>
  )
}
