'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithOTP, verifyOTP } from '@/lib/supabase/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, ArrowRight, Mail } from 'lucide-react'
import { Logo } from '@/components/advontier-ui/Logo'

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
      setTimeout(() => router.push('/backyard'), 1000)
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
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-zinc-200 px-8 py-10 flex flex-col gap-8">
      {/* Optional: Advontier Logo for trust */}
      <div className="flex justify-center mb-2">
        <Logo className="h-8 w-auto" />
      </div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="font-display text-xl font-semibold text-neutral-900">
          Sign in with your email
        </h2>
        <p className="text-sm text-zinc-500">
          Secure one-time code login for Advontier Practice Manager.
        </p>
      </div>

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
        <form
          onSubmit={handleOTPLogin}
          className="space-y-5"
        >
          <div className="space-y-1">
            <Label htmlFor="email" className="text-base text-neutral-900 font-medium">
              Work Email Address
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-base font-semibold rounded-xl shadow-sm"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send login code'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-zinc-400 text-center">
            We’ll email you a secure 6-digit code.
          </p>
        </form>
      ) : (
        <form
          onSubmit={handleOTPVerification}
          className="space-y-5"
        >
          <div className="space-y-1">
            <Label htmlFor="otp" className="text-base text-neutral-900 font-medium">
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white text-base font-semibold rounded-xl shadow-sm"
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
        <a href="mailto:info@advontier.com" className="text-blue-500 underline">
          Contact support
        </a>
      </p>
    </div>
  )
}
