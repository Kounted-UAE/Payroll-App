'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Card, CardContent, CardHeader, CardTitle,
  Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Checkbox, Badge
} from "@/components/ui"
import {
  ArrowLeft, ArrowRight, DollarSign, Plus, Trash2,
  CheckCircle, AlertCircle, Calculator
} from "lucide-react"
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface SalaryComponent {
  id: string
  name: string
  type: "allowance" | "deduction"
  amount: string
  is_percentage: boolean
  is_taxable: boolean
}

interface SalaryStructureData {
  title: string
  description: string
  basic_salary: string
  currency: string
  components: SalaryComponent[]
  confirmation: boolean
}

const CreateSalaryStructureWizard = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState({
    title: "",
    description: "",
    basic_salary: "",
    currency: "AED",
    employer_id: "",
    payTypeAmounts: {}, // { [payTypeId]: amount }
    confirmation: false
  })
  const [payTypes, setPayTypes] = useState<any[]>([]);

  // Fetch pay types for employer
  useEffect(() => {
    async function fetchPayTypes() {
      if (!data.employer_id) return;
      const { data: types, error } = await supabase
        .from('payroll_pay_types')
        .select('*')
        .eq('employer_id', data.employer_id)
        .in('type', ['allowance', 'deduction']);
      if (!error && types) setPayTypes(types);
    }
    fetchPayTypes();
  }, [data.employer_id]);

  const steps = [
    { id: 1, title: "Basic Information", description: "Structure name and basic salary" },
    { id: 2, title: "Salary Components", description: "Allowances and deductions" },
    { id: 3, title: "Review & Create", description: "Review and create structure" }
  ]

  const updatePayTypeAmount = (payTypeId: string, value: string) => {
    setData(prev => ({
      ...prev,
      payTypeAmounts: { ...prev.payTypeAmounts, [payTypeId]: value }
    }));
  };

  const calculateTotals = () => {
    const basicSalary = parseFloat(data.basic_salary || "0")
    let totalAllowances = 0
    let totalDeductions = 0
    payTypes.forEach(pt => {
      const amount = parseFloat(data.payTypeAmounts[pt.id] || "0")
      if (pt.type === "allowance") totalAllowances += amount
      else if (pt.type === "deduction") totalDeductions += amount
    })
    return {
      basicSalary,
      totalAllowances,
      totalDeductions,
      grossSalary: basicSalary + totalAllowances,
      netSalary: basicSalary + totalAllowances - totalDeductions
    }
  }

  const totals = calculateTotals()

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // On submit: insert salary structure and items
      // ... (implementation placeholder)
      router.push("/payroll/salary-structures")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.title && data.basic_salary && data.employer_id
      case 2: return true
      case 3: return data.confirmation
      default: return false
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Employer *</Label>
            <Input value={data.employer_id} onChange={e => setData(d => ({ ...d, employer_id: e.target.value }))} placeholder="Employer ID" />
            <Label>Title *</Label>
            <Input value={data.title} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
            <Label>Description</Label>
            <Input value={data.description} onChange={e => setData(d => ({ ...d, description: e.target.value }))} />
            <Label>Basic Salary *</Label>
            <Input value={data.basic_salary} onChange={e => setData(d => ({ ...d, basic_salary: e.target.value }))} type="number" />
            <Label>Currency</Label>
            <Select value={data.currency} onValueChange={v => setData(d => ({ ...d, currency: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="AED">AED</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}
      {/* Step 2: Salary Components */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Salary Components</CardTitle>
          </CardHeader>
          <CardContent>
            {payTypes.length === 0 && <div>No pay types defined for this employer.</div>}
            {payTypes.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {payTypes.map(pt => (
                  <div key={pt.id}>
                    <Label htmlFor={`paytype-${pt.id}`}>{pt.label}</Label>
                    <Input
                      id={`paytype-${pt.id}`}
                      type="number"
                      value={data.payTypeAmounts[pt.id] || ''}
                      onChange={e => updatePayTypeAmount(pt.id, e.target.value)}
                      placeholder={pt.code}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {/* Step 3: Review & Create */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Create</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Basic Salary: {data.currency} {data.basic_salary}</div>
            {payTypes.map(pt => (
              <div key={pt.id}>{pt.label}: {data.currency} {data.payTypeAmounts[pt.id] || 0}</div>
            ))}
            <div>Gross Salary: {data.currency} {totals.grossSalary}</div>
            <div>Net Salary: {data.currency} {totals.netSalary}</div>
            <Checkbox checked={data.confirmation} onCheckedChange={v => setData(d => ({ ...d, confirmation: !!v }))} /> Confirm and create
          </CardContent>
        </Card>
      )}
      <div className="flex space-x-2 mt-4">
        <Button onClick={handlePrevious} disabled={currentStep === 1}>Previous</Button>
        <Button onClick={handleNext} disabled={!canProceed()}>{currentStep === 3 ? 'Create Structure' : 'Next'}</Button>
      </div>
    </div>
  )
}

export default CreateSalaryStructureWizard
