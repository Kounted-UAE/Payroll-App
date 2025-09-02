// AddSalaryTemplateWizard.tsx – Assign salary components to an employee
'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSession } from '@/hooks/useSession'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'

// Function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  return createClient(supabaseUrl, supabaseKey)
}

export default function AddSalaryTemplateWizard({ employeeId, onComplete, onCancel }: {
  employeeId: string
  onComplete?: () => void
  onCancel?: () => void
}) {
  const { session } = useSession()
  const [payTypes, setPayTypes] = useState<any[]>([])
  const [components, setComponents] = useState<{ pay_type_id: string, amount: number, is_fixed: boolean }[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseClient()
    supabase.from('payroll_pay_types')
      .select('id, name, core_type')
      .then(({ data }) => {
        if (data) setPayTypes(data)
      })
  }, [])

  const updateComponent = (index: number, key: string, value: any) => {
    setComponents(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [key]: value }
      return updated
    })
  }

  const addComponent = () => {
    setComponents(prev => [...prev, { pay_type_id: '', amount: 0, is_fixed: true }])
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const effective_from = new Date().toISOString().split('T')[0]
      const insertData = components.filter(c => c.pay_type_id && c.amount > 0).map(c => ({
        employee_id: employeeId,
        pay_type_id: c.pay_type_id,
        amount: c.amount,
        is_fixed: c.is_fixed,
        effective_from,
        created_by_user_id: session?.user?.id || null,
        created_at: new Date().toISOString()
      }))

      const supabase = createSupabaseClient()
      const { error } = await supabase.from('payroll_salary_templates').insert(insertData)
      if (error) throw error

      toast({ title: 'Template Saved', description: 'Salary structure saved successfully' })
      onComplete?.()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save template', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Salary Template Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {components.map((c, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-4 items-end">
              <div>
                <Label>Pay Type</Label>
                <select
                  className="w-full border p-2 rounded"
                  value={c.pay_type_id}
                  onChange={e => updateComponent(i, 'pay_type_id', e.target.value)}
                >
                  <option value="">Select type</option>
                  {payTypes.map(pt => (
                    <option key={pt.id} value={pt.id}>{pt.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={c.amount}
                  onChange={e => updateComponent(i, 'amount', parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label>Is Fixed</Label>
                <select
                  className="w-full border p-2 rounded"
                  value={String(c.is_fixed)}
                  onChange={e => updateComponent(i, 'is_fixed', e.target.value === 'true')}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <Button type="button" onClick={() => updateComponent(i, 'amount', 0)}>Clear</Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addComponent}>Add Pay Item</Button>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : (<><Save className="w-4 h-4 mr-1" /> Save Template</>)}
        </Button>
      </div>
    </div>
  )
}
