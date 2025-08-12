// app/advontier/payroll/employers/AddEmployerWizard.tsx
'use client'

import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSession } from '@/hooks/useSession'
import { toast } from '@/hooks/use-toast'
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Save, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const STEPS = [
  { id: 1, title: 'Company Details' },
  { id: 2, title: 'WPS + Bank Info' },
  { id: 3, title: 'Payroll Contact + Review' }
]

export default function AddEmployerWizard({ onComplete, onCancel }: {
  onComplete?: (data: any) => void
  onCancel?: () => void
}) {
  const { session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    entity_id: '',
    jurisdiction: '',
    legal_name: '',
    wps_employer_id: '',
    mohre_establishment_id: '',
    bank_name: '',
    company_iban: '',
    company_account_number: '',
    routing_code: '',
    email_address: '',
    payroll_contact_name: '',
    payroll_contact_email: ''
  })

  const updateField = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('payroll_objects_employers')
        .insert([{
          entity_id: formData.entity_id || null,
          jurisdiction: formData.jurisdiction?.trim() || null,
          legal_name: formData.legal_name.trim(),
          wps_employer_id: formData.wps_employer_id?.trim() || null,
          mohre_establishment_id: formData.mohre_establishment_id?.trim() || null,
          bank_name: formData.bank_name.trim(),
          company_iban: formData.company_iban.trim(),
          company_account_number: formData.company_account_number?.trim() || null,
          routing_code: formData.routing_code?.trim() || null,
          email_address: formData.email_address?.trim() || null,
          payroll_contact_name: formData.payroll_contact_name?.trim() || null,
          payroll_contact_email: formData.payroll_contact_email?.trim() || null,
          salary_transfer_method: 'WPS',
          status: 'Active',
          created_by_user_id: session?.user?.id || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      toast({ title: 'Success', description: 'Employer created successfully.' })
      onComplete?.(data)
      router.push('/advontier/payroll/employers')
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to create employer.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid gap-4">
            <div><Label>Legal Name</Label><Input value={formData.legal_name} onChange={e => updateField('legal_name', e.target.value)} /></div>
            <div><Label>Jurisdiction</Label><Input value={formData.jurisdiction} onChange={e => updateField('jurisdiction', e.target.value)} /></div>
            <div><Label>Entity ID</Label><Input value={formData.entity_id} onChange={e => updateField('entity_id', e.target.value)} /></div>
          </div>
        )
      case 2:
        return (
          <div className="grid gap-4">
            <div><Label>WPS Employer ID</Label><Input value={formData.wps_employer_id} onChange={e => updateField('wps_employer_id', e.target.value)} /></div>
            <div><Label>MOHRE Establishment ID</Label><Input value={formData.mohre_establishment_id} onChange={e => updateField('mohre_establishment_id', e.target.value)} /></div>
            <div><Label>Bank Name</Label><Input value={formData.bank_name} onChange={e => updateField('bank_name', e.target.value)} /></div>
            <div><Label>IBAN</Label><Input value={formData.company_iban} onChange={e => updateField('company_iban', e.target.value)} /></div>
            <div><Label>Account Number</Label><Input value={formData.company_account_number} onChange={e => updateField('company_account_number', e.target.value)} /></div>
            <div><Label>Routing Code</Label><Input value={formData.routing_code} onChange={e => updateField('routing_code', e.target.value)} /></div>
          </div>
        )
      case 3:
        return (
          <div className="grid gap-4">
            <div><Label>Payroll Contact Name</Label><Input value={formData.payroll_contact_name} onChange={e => updateField('payroll_contact_name', e.target.value)} /></div>
            <div><Label>Payroll Contact Email</Label><Input type="email" value={formData.payroll_contact_email} onChange={e => updateField('payroll_contact_email', e.target.value)} /></div>
            <div><Label>General Contact Email</Label><Input type="email" value={formData.email_address} onChange={e => updateField('email_address', e.target.value)} /></div>
          </div>
        )
      default:
        return null
    }
  }

  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Add Employer</h1>
        <Progress value={progress} className="mt-2 h-2" />
      </div>

      <Card>
        <CardHeader><CardTitle>{STEPS.find(s => s.id === currentStep)?.title}</CardTitle></CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel || (() => router.push('/advontier/payroll/employers'))}>Cancel</Button>
        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          )}
          <Button onClick={() => {
            if (currentStep === STEPS.length) handleComplete()
            else setCurrentStep(s => s + 1)
          }}>
            {loading ? 'Processing…' : (
              currentStep === STEPS.length ? (
                <><Save className="w-4 h-4 mr-1" /> Save</>
              ) : (
                <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
              )
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
