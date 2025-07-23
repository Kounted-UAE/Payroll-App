import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  ArrowRight, 
  DollarSign,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Calculator
} from "lucide-react"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()
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
    { name: "Housing Allowance", type: "allowance" as const, suggested_amount: "30", is_percentage: true },
    { name: "Transportation Allowance", type: "allowance" as const, suggested_amount: "1000", is_percentage: false },
    { name: "Mobile Allowance", type: "allowance" as const, suggested_amount: "300", is_percentage: false },
    { name: "Medical Insurance", type: "allowance" as const, suggested_amount: "500", is_percentage: false },
    { name: "Social Security", type: "deduction" as const, suggested_amount: "12.5", is_percentage: true },
    { name: "Professional Tax", type: "deduction" as const, suggested_amount: "200", is_percentage: false }
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
      // Create salary structure
      navigate("/payroll/salary-structures")
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
      case 2: return true // Components are optional
      case 3: return data.confirmation
      default: return false
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Salary Structure</h1>
          <p className="text-muted-foreground">
            Define a new salary structure template with allowances and deductions
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/payroll/salary-structures")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Structures
        </Button>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                  </div>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-px w-20 mx-4 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <p className="text-muted-foreground mb-6">Define the basic structure details and base salary</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Structure Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Senior Software Engineer, Manager Level 2"
                      value={data.title}
                      onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of this salary structure"
                      value={data.description}
                      onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={data.currency} onValueChange={(value) => 
                      setData(prev => ({ ...prev, currency: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="basic_salary">Basic Salary *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="basic_salary"
                        type="number"
                        placeholder="0.00"
                        value={data.basic_salary}
                        onChange={(e) => setData(prev => ({ ...prev, basic_salary: e.target.value }))}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {data.basic_salary && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Basic Salary</p>
                      <p className="text-blue-700">
                        {data.currency} {parseFloat(data.basic_salary).toLocaleString()} per month
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Salary Components</h3>
                  <p className="text-muted-foreground">Add allowances and deductions to complete the salary structure</p>
                </div>
                <Button variant="outline" onClick={() => addComponent()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Component
                </Button>
              </div>

              {/* Quick Add Predefined Components */}
              <div>
                <Label className="text-sm font-medium">Quick Add Common Components</Label>
                <div className="grid md:grid-cols-3 gap-2 mt-2">
                  {predefinedComponents.map((comp) => (
                    <Button
                      key={comp.name}
                      variant="outline"
                      size="sm"
                      onClick={() => addComponent(comp)}
                      className="justify-start"
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      {comp.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Components List */}
              <div className="space-y-4">
                {data.components.map((component) => (
                  <Card key={component.id}>
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-6 gap-4 items-end">
                        <div className="md:col-span-2">
                          <Label className="text-sm">Component Name</Label>
                          <Input
                            value={component.name}
                            onChange={(e) => updateComponent(component.id, "name", e.target.value)}
                            placeholder="Component name"
                          />
                        </div>

                        <div>
                          <Label className="text-sm">Type</Label>
                          <Select 
                            value={component.type} 
                            onValueChange={(value) => updateComponent(component.id, "type", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="allowance">Allowance</SelectItem>
                              <SelectItem value="deduction">Deduction</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm">Amount</Label>
                          <Input
                            type="number"
                            value={component.amount}
                            onChange={(e) => updateComponent(component.id, "amount", e.target.value)}
                            placeholder="0.00"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={component.is_percentage}
                              onCheckedChange={(checked) => updateComponent(component.id, "is_percentage", checked)}
                            />
                            <Label className="text-sm">Percentage</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={component.is_taxable}
                              onCheckedChange={(checked) => updateComponent(component.id, "is_taxable", checked)}
                            />
                            <Label className="text-sm">Taxable</Label>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge variant={component.type === "allowance" ? "default" : "destructive"}>
                            {component.type}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeComponent(component.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Salary Calculation Preview */}
              {data.basic_salary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Salary Calculation Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {data.currency} {totals.basicSalary.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Basic Salary</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {data.currency} {totals.totalAllowances.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Allowances</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {data.currency} {totals.totalDeductions.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Deductions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">
                          {data.currency} {totals.netSalary.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Net Salary</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review & Create</h3>
                <p className="text-muted-foreground mb-6">Review the salary structure before creation</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Structure Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Title</Label>
                      <p className="font-medium">{data.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Description</Label>
                      <p className="font-medium">{data.description || "No description"}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Currency</Label>
                      <p className="font-medium">{data.currency}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Basic Salary</Label>
                      <p className="font-medium text-blue-600">
                        {data.currency} {totals.basicSalary.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Final Calculation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic Salary:</span>
                      <span className="font-medium">{data.currency} {totals.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Allowances:</span>
                      <span className="font-medium text-green-600">+ {data.currency} {totals.totalAllowances.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Deductions:</span>
                      <span className="font-medium text-red-600">- {data.currency} {totals.totalDeductions.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Net Salary:</span>
                        <span className="font-bold text-purple-600">{data.currency} {totals.netSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Components Summary */}
              {data.components.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Components Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {data.components.map((comp) => (
                        <div key={comp.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <Badge variant={comp.type === "allowance" ? "default" : "destructive"} className="text-xs">
                              {comp.type}
                            </Badge>
                            <span className="font-medium">{comp.name}</span>
                          </div>
                          <span className="text-sm">
                            {comp.is_percentage ? `${comp.amount}%` : `${data.currency} ${comp.amount}`}
                            {comp.is_taxable && <span className="text-xs text-muted-foreground ml-1">(Taxable)</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Ready to Create</p>
                    <p className="text-green-800 text-sm mt-1">
                      This salary structure will be saved and can be applied to employees. You can edit it later if needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={data.confirmation}
                  onCheckedChange={(checked) => setData(prev => ({ ...prev, confirmation: checked as boolean }))}
                />
                <Label>I confirm that the salary structure details are correct and want to create it</Label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {currentStep === 3 ? "Create Structure" : "Next"}
          {currentStep < 3 && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

export default CreateSalaryStructureWizard