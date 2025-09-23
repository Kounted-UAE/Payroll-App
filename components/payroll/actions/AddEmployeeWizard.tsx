// app/payroll/employees/AddEmployeeWizard.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSession } from '@/hooks/useSession'
import { toast } from '@/hooks/use-toast'
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/react-ui/card'
import { Button } from '@/components/react-ui/button'
import { Input } from '@/components/react-ui/input'
import { Label } from '@/components/react-ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/react-ui/select'
import { Progress } from '@/components/react-ui/progress'
import {
  ChevronLeft, ChevronRight, Save
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

const STEPS = [
  { id: 1, title: 'Employment Details' },
  { id: 2, title: 'Employee Details' },
  { id: 3, title: 'Banking Details' },
  { id: 4, title: 'Review & Submit' }
]

export default function AddEmployeeWizard({ onComplete, onCancel }: {
  onComplete?: (data: any) => void
  onCancel?: () => void
}) {
  const { session } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [employers, setEmployers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    employer_id: '',
    first_name: '',
    last_name: '',
    email: '',
    contact_number: '',
    emirates_id: '',
    passport_number: '',
    nationality: '',
    start_date: '',
    iban: '',
    bank_name: ''
  })

  useEffect(() => {
    const supabase = createSupabaseClient()
    supabase.from('payroll_objects_employers')
      .select('id, legal_name')
      .then(({ data }) => data && setEmployers(data))
  }, [])

  const updateField = (name: string, value: any) =>
    setFormData(prev => ({ ...prev, [name]: value }))

  const handleComplete = async () => {
    setLoading(true)
    try {
      const full_name = `${formData.first_name} ${formData.last_name}`.trim()

      const supabase = createSupabaseClient()
      const { data: employee, error } = await supabase
        .from('payroll_objects_employees')
        .insert([{
          employer_id: formData.employer_id,
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          full_name,
          email: formData.email.trim().toLowerCase(),
          contact_number: formData.contact_number?.trim() || null,
          emirates_id: formData.emirates_id?.trim() || null,
          passport_number: formData.passport_number?.trim() || null,
          nationality: formData.nationality?.trim() || null,
          start_date: formData.start_date || new Date().toISOString().split('T')[0],
          iban: formData.iban?.trim() || null,
          bank_name: formData.bank_name?.trim() || null,
          status: 'Active',
          created_by_user_id: session?.user?.id || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      toast({ title: 'Success', description: 'Employee added successfully.' })
      onComplete?.(employee)
      router.push('/kounted/payroll/employees')
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to create employee.',
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
            <div>
              <Label>Employer</Label>
              <Select value={formData.employer_id} onValueChange={val => updateField('employer_id', val)}>
                <SelectTrigger><SelectValue placeholder="Select Employer" /></SelectTrigger>
                <SelectContent>
                  {employers.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.legal_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={formData.start_date} onChange={e => updateField('start_date', e.target.value)} />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="grid gap-4">
            <div><Label>First Name</Label><Input value={formData.first_name} onChange={e => updateField('first_name', e.target.value)} /></div>
            <div><Label>Last Name</Label><Input value={formData.last_name} onChange={e => updateField('last_name', e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} /></div>
            <div><Label>Contact Number</Label><Input value={formData.contact_number} onChange={e => updateField('contact_number', e.target.value)} /></div>
            <div><Label>Emirates ID</Label><Input value={formData.emirates_id} onChange={e => updateField('emirates_id', e.target.value)} /></div>
            <div><Label>Passport Number</Label><Input value={formData.passport_number} onChange={e => updateField('passport_number', e.target.value)} /></div>
            <div><Label>Nationality</Label><Input value={formData.nationality} onChange={e => updateField('nationality', e.target.value)} /></div>
          </div>
        )
      case 3:
        return (
          <div className="grid gap-4">
            <div><Label>Bank Name</Label><Input value={formData.bank_name} onChange={e => updateField('bank_name', e.target.value)} /></div>
            <div><Label>IBAN</Label><Input value={formData.iban} onChange={e => updateField('iban', e.target.value)} /></div>
          </div>
        )
      case 4:
        return (
          <div className="grid gap-2 text-sm">
            <p><strong>Full Name:</strong> {formData.first_name} {formData.last_name}</p>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Emirates ID:</strong> {formData.emirates_id}</p>
            <p><strong>Employer:</strong> {employers.find(e => e.id === formData.employer_id)?.legal_name || 'N/A'}</p>
            <p><strong>Start Date:</strong> {formData.start_date}</p>
            <p><strong>Bank:</strong> {formData.bank_name}</p>
            <p><strong>IBAN:</strong> {formData.iban}</p>
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
        <h1 className="text-2xl font-bold">Add Employee</h1>
        <Progress value={progress} className="mt-2 h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS.find(s => s.id === currentStep)?.title}</CardTitle>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel || (() => router.push('/kounted/payroll/employees'))}>Cancel</Button>
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
