// components/drawers/EmployeeDrawer.tsx

'use client'

import { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import type { Database } from '@/lib/types/supabase'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type Employee = Database['public']['Tables']['payroll_objects_employees']['Row']
type Employer = Database['public']['Tables']['payroll_objects_employers']['Row']

type Mode = 'view' | 'edit' | 'delete'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: Mode
  employee: Employee & {
    payroll_objects_employers: Pick<Employer, 'legal_name'> | null
  }
  onSave?: (updates: Partial<Employee>) => Promise<void>
  onDelete?: () => Promise<void>
}

export function EmployeeDrawer({ open, onOpenChange, employee, mode, onSave, onDelete }: Props) {
  const [formData, setFormData] = useState<Partial<Employee>>(employee)
  const [submitting, setSubmitting] = useState(false)

  const isView = mode === 'view'
  const isEdit = mode === 'edit'
  const isDelete = mode === 'delete'

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!onSave) return
    setSubmitting(true)
    try {
      await onSave(formData)
      toast({ title: 'Employee updated' })
      onOpenChange(false)
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update employee', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    setSubmitting(true)
    try {
      await onDelete()
      toast({ title: 'Employee deleted' })
      onOpenChange(false)
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete employee', variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (label: string, field: keyof Employee, isCurrency = false) => {
    const value = formData[field]
  
    const displayValue =
      value === null || value === undefined
        ? '—'
        : typeof value === 'object'
          ? JSON.stringify(value)
          : isCurrency
            ? `${value} AED`
            : String(value)
  
            return (
              <div>
                <Label>{label}</Label>
                {isView || isDelete ? (
                  <p className="text-sm mt-1">{displayValue}</p>
                ) : field === 'status' ? (
                  <Select
                    value={formData.status || 'Active'}
                    onValueChange={(val) => handleChange('status', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={formData[field] as string || ''}
                    onChange={e => handleChange(field, e.target.value)}
                  />
                )}
              </div>
            )
            
  }
  

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-4xl mx-auto">
        <DrawerHeader>
          <DrawerTitle>
            {employee.full_name}{' '}
            {employee.payroll_objects_employers?.legal_name && (
              <span className="text-sm font-normal text-muted-foreground">
                ({employee.payroll_objects_employers.legal_name})
              </span>
            )}
          </DrawerTitle>
          <DrawerDescription>
            {isView && 'View employee details'}
            {isEdit && 'Edit employee fields and save changes'}
            {isDelete && 'Are you sure you want to delete this employee?'}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-4">
            {renderField('First Name', 'first_name')}
            {renderField('Last Name', 'last_name')}
            {renderField('Full Name', 'full_name')}
            {renderField('Email', 'email')}
            {renderField('Emirates ID', 'emirates_id')}
            {renderField('Passport Number', 'passport_number')}
            {renderField('Nationality', 'nationality')}
            {renderField('Job Title', 'job_title')}
            {renderField('Contract Type', 'contract_type')}
            {renderField('Start Date', 'start_date')}
            {renderField('Bank Name', 'bank_name')}
            {renderField('Routing Code', 'routing_code')}
            {renderField('Account Number', 'account_number')}
            {renderField('IBAN', 'iban')}
            {renderField('Currency', 'currency')}
            {renderField('Base Salary', 'base_salary', true)}
            {renderField('Housing Allowance', 'housing_allowance', true)}
            {renderField('Transport Allowance', 'transport_allowance', true)}
            {renderField('Food Allowance', 'food_allowance', true)}
          </div>
        </div>

        <DrawerFooter>
          {isEdit && (
            <Button onClick={handleSave} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
          {isDelete && (
            <Button onClick={handleDelete} variant="destructive" disabled={submitting}>
              {submitting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          )}
          {isView && (
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          )}
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
