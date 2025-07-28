'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSession } from '@/hooks/useSession'
import { toast } from '@/hooks/use-toast'
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import {
  ChevronLeft, ChevronRight, Save, Check,
  User, Building, CreditCard, DollarSign, Eye, Plus
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const STEPS = [
  { id: 1, title: 'Employment Details', icon: Building },
  { id: 2, title: 'Employee Details', icon: User },
  { id: 3, title: 'Banking Details', icon: CreditCard },
  { id: 4, title: 'Salary Setup', icon: DollarSign },
  { id: 5, title: 'Review & Submit', icon: Eye }
]

export default function AddEmployeeWizard({ onComplete, onCancel }: {
  onComplete?: (data: any) => void
  onCancel?: () => void
}) {
  const { session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [employers, setEmployers] = useState<any[]>([])
  const [payTypes, setPayTypes] = useState<any[]>([])
  const [formData, setFormData] = useState({
    employer_id: '',
    first_name: '',
    last_name: '',
    email: '',
    emirates_id: '',
    passport_number: '',
    nationality: '',
    bank_name: '',
    routing_code: '',
    account_number: '',
    iban: '',
    salary_setup: [] as any[]
  })

  useEffect(() => {
    supabase.from('payroll_objects_employers')
      .select('id, legal_name')
      .then(({ data }) => data && setEmployers(data))

    supabase.from('payroll_pay_types')
      .select('id, name, group')
      .then(({ data }) => data && setPayTypes(data))
  }, [])

  const updateField = (name: string, value: any) =>
    setFormData(prev => ({ ...prev, [name]: value }))

  const handleComplete = async () => {
    setLoading(true)
    try {
      const full_name = `${formData.first_name} ${formData.last_name}`.trim()

      const { data: employee, error } = await supabase
        .from('payroll_objects_employees')
        .insert([{
        employer_id: formData.employer_id,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
          full_name,
          email: formData.email.trim().toLowerCase(),
        emirates_id: formData.emirates_id?.trim() || null,
        passport_number: formData.passport_number?.trim() || null,
        nationality: formData.nationality?.trim() || null,
        bank_name: formData.bank_name?.trim() || null,
        routing_code: formData.routing_code?.trim() || null,
        account_number: formData.account_number?.trim() || null,
        iban: formData.iban?.trim() || null,
          start_date: new Date().toISOString().split('T')[0],
        status: 'Active',
        created_by_user_id: session?.user?.id || null,
        created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      if (formData.salary_setup.length > 0) {
        const components = formData.salary_setup
          .filter(item => item.pay_type_id && item.amount > 0)
          .map(item => ({
            employee_id: employee.id,
            pay_type_id: item.pay_type_id,
            amount: item.amount,
            effective_from: item.effective_from || new Date().toISOString().split('T')[0],
            currency: item.currency || 'AED',
            created_by_user_id: session?.user?.id || null
          }))
        if (components.length > 0) {
          const { error: salaryError } = await supabase
            .from('payroll_salary_structures')
            .insert(components)
          if (salaryError) throw salaryError
        }
      }

      toast({ title: 'Success', description: 'Employee added' })
      onComplete?.(employee)
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.message || 'Failed to create employee',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Add Employee</h1>
        <Progress value={progress} className="mt-2 h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS.find(s => s.id === currentStep)?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* You can modularize step components here if needed */}
          <p className="text-muted-foreground">Step {currentStep} UI here…</p>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel || (() => window.history.back())}>
          Cancel
        </Button>
        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
          </Button>
          )}
          <Button onClick={() => {
            if (currentStep === STEPS.length) handleComplete()
            else setCurrentStep(s => s + 1)
          }}>
            {loading ? 'Processing…' : (
              currentStep === STEPS.length ? (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
