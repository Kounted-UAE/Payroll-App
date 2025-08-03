'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithOTP, verifyOTP } from '@/lib/supabase/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, ArrowRight, Mail } from 'lucide-react'
import { Logomark } from '@/components/advontier-ui/Logo'
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
    <div className="w-full max-w-md mx-auto space-y-6 text-white">
      {/* Header */}
      <div className="space-y-3 text-center">       
        <p className="text-md text-zinc-400">
          Enter your email to receive a secure one-time login code.
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
          className="space-y-5 bg-white/5 backdrop-blur-md border border-border rounded-2xl p-6 shadow-lg"
        >
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm text-blue-600">
              Enter your Kounted email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@kounted.ae"
                className="pl-10 bg-white text-black text-sm"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white text-sm"
            disabled={loading}
          >
            {loading ? 'Sending OTP...' : 'Send OTP to Email'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-zinc-400">
            We’ll send a 6-digit login code to your email address.
          </p>
        </form>
      ) : (
        <form
          onSubmit={handleOTPVerification}
          className="space-y-5 bg-white/5 backdrop-blur-md border border-border rounded-2xl p-6 shadow-lg"
        >
          <div className="space-y-1">
            <Label htmlFor="otp" className="text-sm text-blue-500">
              Enter OTP Code
            </Label>
            <Input
              id="otp"
              type="text"
              value={otpToken}
              onChange={(e) => setOtpToken(e.target.value)}
              placeholder="123456"
              className="text-center text-sm tracking-widest text-black bg-white"
              maxLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Sign In'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="ghost" onClick={resetOTPFlow} className="text-sm text-zinc-400">
            ← Back to email entry
          </Button>
        </form>
      )}

      {/* Support info */}
      <p className="text-center text-sm text-zinc-400">
        Need help? Contact{' '}
        <a href="mailto:app-accounts@advontier.com" className="text-blue-400 underline">
          app-accounts@advontier.com
        </a>
      </p>
    </div>
  )
}
