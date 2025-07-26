'use client'

import { useState } from "react"
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
  const [data, setData] = useState<SalaryStructureData>({
    title: "",
    description: "",
    basic_salary: "",
    currency: "AED",
    components: [],
    confirmation: false
  })

  const predefinedComponents = [
    { name: "Housing Allowance", type: "allowance", suggested_amount: "30", is_percentage: true },
    { name: "Transportation Allowance", type: "allowance", suggested_amount: "1000", is_percentage: false },
    { name: "Mobile Allowance", type: "allowance", suggested_amount: "300", is_percentage: false },
    { name: "Medical Insurance", type: "allowance", suggested_amount: "500", is_percentage: false },
    { name: "Social Security", type: "deduction", suggested_amount: "12.5", is_percentage: true },
    { name: "Professional Tax", type: "deduction", suggested_amount: "200", is_percentage: false }
  ]

  const steps = [
    { id: 1, title: "Basic Information", description: "Structure name and basic salary" },
    { id: 2, title: "Salary Components", description: "Allowances and deductions" },
    { id: 3, title: "Review & Create", description: "Review and create structure" }
  ]

  const addComponent = (component: any = null) => {
    const newComponent: SalaryComponent = {
      id: Date.now().toString(),
      name: component?.name || "",
      type: component?.type || "allowance",
      amount: component?.suggested_amount || "",
      is_percentage: component?.is_percentage || false,
      is_taxable: component?.type === "allowance"
    }
    setData(prev => ({ ...prev, components: [...prev.components, newComponent] }))
  }

  const updateComponent = (id: string, field: keyof SalaryComponent, value: any) => {
    setData(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === id ? { ...comp, [field]: value } : comp
      )
    }))
  }

  const removeComponent = (id: string) => {
    setData(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id)
    }))
  }

  const calculateTotals = () => {
    const basicSalary = parseFloat(data.basic_salary || "0")
    let totalAllowances = 0
    let totalDeductions = 0

    data.components.forEach(comp => {
      const amount = parseFloat(comp.amount || "0")
      const value = comp.is_percentage ? (basicSalary * amount / 100) : amount
      if (comp.type === "allowance") {
        totalAllowances += value
      } else {
        totalDeductions += value
      }
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
      case 1: return data.title && data.basic_salary
      case 2: return true
      case 3: return data.confirmation
      default: return false
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* ... UI omitted for brevity; identical to original except `navigate` → `router.push` ... */}
    </div>
  )
}

export default CreateSalaryStructureWizard
