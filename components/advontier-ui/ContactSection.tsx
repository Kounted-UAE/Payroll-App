'use client'

import { useState } from 'react'
import { Button } from '@/components/advontier-ui/Button'
import { Container } from '@/components/advontier-ui/Container'
import { FadeIn } from '@/components/advontier-ui/FadeIn'
import { Offices } from '@/components/advontier-ui/Offices'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog' // Assumes shadcn or similar
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export function ContactSection() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/feature-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSuccess(true)
        setForm({ name: '', email: '', message: '' })
      } else {
        setError('Submission failed. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Container className="mt-24 sm:mt-32 lg:mt-40">
        <FadeIn className="-mx-6 rounded-4xl bg-neutral-950 px-6 py-20 sm:mx-0 sm:py-32 md:px-12">
          <div className="mx-auto max-w-4xl">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-medium text-balance text-white sm:text-4xl">
                What features would you like to see?
              </h2>
              <div className="mt-6 flex">
                <Button type="button" invert onClick={() => setOpen(true)}>
                  Suggest a Feature
                </Button>
              </div>
              <div className="mt-10 border-t border-white/10 pt-10">
                <h3 className="font-display text-base font-semibold text-white">
                  Our offices
                </h3>
                <Offices
                  invert
                  className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2"
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>

      <Dialog open={open} onOpenChange={setOpen} >
        <DialogContent className="bg-neutral-200">
          <DialogHeader>
            <DialogTitle>Feature Request</DialogTitle>
          </DialogHeader>
          {success ? (
            <div className="text-center text-neutral-950">Thank you! Your suggestion has been submitted.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
              <Input
                name="email"
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Textarea
                name="message"
                placeholder="Describe the feature you want…"
                value={form.message}
                onChange={handleChange}
                required
                rows={3}
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting…' : 'Submit'}
                </Button>
                <Button type="button" invert onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
