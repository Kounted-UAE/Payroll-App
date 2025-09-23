'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/react-ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/react-ui/card'
import { Checkbox } from '@/components/react-ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/react-ui/dialog'
import { Badge } from '@/components/react-ui/badge'
import { X, Settings, Shield, BarChart3, Target } from 'lucide-react'
import Link from 'next/link'

// Extend Window interface to include dataLayer for Google Analytics
declare global {
  interface Window {
    dataLayer: any[]
  }
}

interface CookieConsent {
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
  version: string
}

const CONSENT_VERSION = '1.0'
const CONSENT_KEY = 'kounted-cookie-consent'

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
    timestamp: '',
    version: CONSENT_VERSION,
  })

  useEffect(() => {
    // Check if consent has been given
    const savedConsent = localStorage.getItem(CONSENT_KEY)
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent)
        // Check if consent version is current
        if (parsed.version === CONSENT_VERSION) {
          setConsent(parsed)
          applyConsent(parsed)
        } else {
          // Show banner for new version
          setShowBanner(true)
        }
      } catch (error) {
        setShowBanner(true)
      }
    } else {
      setShowBanner(true)
    }
  }, [])

  const applyConsent = (consentData: CookieConsent) => {
    // Apply consent preferences to tracking scripts
    if (typeof window !== 'undefined') {
      // Google Analytics
      if (consentData.analytics) {
        // Initialize GA if consented
        console.log('Analytics tracking enabled')
      } else {
        // Disable GA if not consented
        console.log('Analytics tracking disabled')
      }

      // Marketing/Advertising cookies
      if (consentData.marketing) {
        console.log('Marketing cookies enabled')
      } else {
        console.log('Marketing cookies disabled')
      }

      // Functional cookies
      if (consentData.functional) {
        console.log('Functional cookies enabled')
      } else {
        console.log('Functional cookies disabled')
      }

      // Set consent flags for other scripts to check
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'consent_update',
        consent: consentData,
      })
    }
  }

  const saveConsent = (consentData: CookieConsent) => {
    const consentWithTimestamp = {
      ...consentData,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentWithTimestamp))
    setConsent(consentWithTimestamp)
    applyConsent(consentWithTimestamp)
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: '',
      version: CONSENT_VERSION,
    })
  }

  const handleRejectAll = () => {
    saveConsent({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: '',
      version: CONSENT_VERSION,
    })
  }

  const handleSavePreferences = () => {
    saveConsent(consent)
  }

  const handleConsentChange = (type: keyof CookieConsent, value: boolean) => {
    setConsent(prev => ({
      ...prev,
      [type]: value,
    }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
        <div className="container mx-auto p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">Cookie Consent</h3>
              </div>
              <p className="text-sm text-zinc-400">
                We use cookies to enhance your experience, analyze site usage, and provide personalized content. 
                By clicking "Accept All", you consent to our use of cookies as described in our{' '}
                <Link href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
              >
                Reject All
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Cookie Preferences
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="text-sm text-zinc-400">
              <p>
                Choose which cookies you want to accept. You can change these settings at any time. 
                Please note that disabling some cookies may impact your experience on our site.
              </p>
            </div>

            {/* Essential Cookies */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <CardTitle className="text-base">Essential Cookies</CardTitle>
                    <Badge variant="secondary">Required</Badge>
                  </div>
                  <Checkbox
                    checked={true}
                    disabled
                    aria-label="Essential cookies (required)"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  These cookies are necessary for the website to function and cannot be disabled. 
                  They include authentication, security, and basic functionality cookies.
                </p>
                <div className="mt-2 text-xs text-zinc-400">
                  <strong>Examples:</strong> Session management, CSRF protection, user preferences
                </div>
              </CardContent>
            </Card>

            {/* Functional Cookies */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-zinc-600" />
                    <CardTitle className="text-base">Functional Cookies</CardTitle>
                    <Badge variant="outline">Optional</Badge>
                  </div>
                  <Checkbox
                    checked={consent.functional}
                    onCheckedChange={(checked) => 
                      handleConsentChange('functional', checked as boolean)
                    }
                    aria-label="Functional cookies"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  These cookies enable enhanced functionality and personalization, such as 
                  remembering your preferences and settings.
                </p>
                <div className="mt-2 text-xs text-zinc-400">
                  <strong>Examples:</strong> Language preferences, theme settings, saved filters
                </div>
              </CardContent>
            </Card>

            {/* Analytics Cookies */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                    <CardTitle className="text-base">Analytics Cookies</CardTitle>
                    <Badge variant="outline">Optional</Badge>
                  </div>
                  <Checkbox
                    checked={consent.analytics}
                    onCheckedChange={(checked) => 
                      handleConsentChange('analytics', checked as boolean)
                    }
                    aria-label="Analytics cookies"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  These cookies help us understand how visitors interact with our website 
                  by collecting and reporting information anonymously.
                </p>
                <div className="mt-2 text-xs text-zinc-400">
                  <strong>Examples:</strong> Google Analytics, usage statistics, performance monitoring
                </div>
              </CardContent>
            </Card>

            {/* Marketing Cookies */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <CardTitle className="text-base">Marketing Cookies</CardTitle>
                    <Badge variant="outline">Optional</Badge>
                  </div>
                  <Checkbox
                    checked={consent.marketing}
                    onCheckedChange={(checked) => 
                      handleConsentChange('marketing', checked as boolean)
                    }
                    aria-label="Marketing cookies"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">
                  These cookies are used to deliver relevant advertisements and track 
                  the effectiveness of marketing campaigns.
                </p>
                <div className="mt-2 text-xs text-zinc-400">
                  <strong>Examples:</strong> Ad targeting, conversion tracking, social media integration
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Reject All
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Save Preferences
              </Button>
            </div>

            <div className="text-xs text-zinc-400 pt-4 border-t">
              <p>
                You can withdraw your consent or modify your preferences at any time by visiting our{' '}
                <Link href="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>{' '}
                page. For more information about how we use cookies, please see our{' '}
                <Link href="/terms-of-service" className="text-primary hover:underline">
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Hook to check consent status
export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY)
    if (savedConsent) {
      try {
        setConsent(JSON.parse(savedConsent))
      } catch (error) {
        setConsent(null)
      }
    }
  }, [])

  const hasConsent = (type: keyof CookieConsent) => {
    return consent?.[type] === true
  }

  const updateConsent = (newConsent: Partial<CookieConsent>) => {
    if (consent) {
      const updatedConsent = {
        ...consent,
        ...newConsent,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem(CONSENT_KEY, JSON.stringify(updatedConsent))
      setConsent(updatedConsent)
    }
  }

  return {
    consent,
    hasConsent,
    updateConsent,
  }
}