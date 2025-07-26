'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload,
  Receipt,
  DollarSign,
  CheckCircle,
  AlertCircle,
  FileText,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"

interface ExpenseData {
  description: string
  category: string
  amount: string
  expense_date: string
  client_id: string
  is_billable: boolean
  receipt_file: File | null
  confirmation: boolean
}

const SubmitExpenseWizard = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<ExpenseData>({
    description: "",
    category: "",
    amount: "",
    expense_date: "",
    client_id: "",
    is_billable: false,
    receipt_file: null,
    confirmation: false
  })

  const categories = [
    "Travel & Transportation",
    "Meals & Entertainment", 
    "Office Supplies",
    "Software & Subscriptions",
    "Training & Education",
    "Marketing & Advertising",
    "Professional Services",
    "Utilities",
    "Other"
  ]

  const clients = [
    { id: "1", name: "Emirates Technology LLC" },
    { id: "2", name: "Al Noor Industries PJSC" },
    { id: "3", name: "Gulf Trading Company LLC" }
  ]

  const steps = [
    { id: 1, title: "Expense Details", description: "Basic expense information" },
    { id: 2, title: "Upload Receipt", description: "Attach receipt documentation" },
    { id: 3, title: "Review & Submit", description: "Review and submit expense" }
  ]

  const selectedClient = clients.find(c => c.id === data.client_id)

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit expense
      router.push("/payroll/expenses")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setData(prev => ({ ...prev, receipt_file: file }))
    }
  }

  const removeFile = () => {
    setData(prev => ({ ...prev, receipt_file: null }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.description && data.category && data.amount && data.expense_date
      case 2: return true // Receipt is optional
      case 3: return data.confirmation
      default: return false
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Expense</h1>
          <p className="text-muted-foreground">
            Submit a new expense claim for reimbursement
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/payroll/expenses")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Expenses
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
                <h3 className="text-lg font-semibold mb-4">Expense Details</h3>
                <p className="text-muted-foreground mb-6">Provide basic information about the expense</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the expense (e.g., Business lunch with client, Office supplies purchase)"
                    value={data.description}
                    onChange={(e) => setData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={data.category} onValueChange={(value) => 
                      setData(prev => ({ ...prev, category: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select expense category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (AED) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={data.amount}
                        onChange={(e) => setData(prev => ({ ...prev, amount: e.target.value }))}
                        className="pl-9"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expense_date">Expense Date *</Label>
                  <Input
                    id="expense_date"
                    type="date"
                    value={data.expense_date}
                    onChange={(e) => setData(prev => ({ ...prev, expense_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Client (if billable)</Label>
                  <Select value={data.client_id} onValueChange={(value) => 
                    setData(prev => ({ ...prev, client_id: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={data.is_billable}
                  onCheckedChange={(checked) => setData(prev => ({ ...prev, is_billable: checked as boolean }))}
                />
                <Label>This expense is billable to a client</Label>
              </div>

              {data.amount && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Expense Summary</p>
                      <p className="text-blue-700">
                        AED {parseFloat(data.amount || "0").toLocaleString()} - {data.category}
                        {data.is_billable && selectedClient && ` (Billable to ${selectedClient.name})`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Upload Receipt</h3>
                <p className="text-muted-foreground mb-6">Attach receipt or supporting documentation (optional but recommended)</p>
              </div>
              
              {!data.receipt_file ? (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium mb-2">Upload Receipt</h4>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop your receipt file here, or click to browse
                  </p>
                  <Button variant="outline" onClick={() => document.getElementById('receipt-upload')?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  <input
                    id="receipt-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-4">
                    Supports: JPG, PNG, PDF (max 10MB)
                  </p>
                </div>
              ) : (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Receipt className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium">{data.receipt_file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(data.receipt_file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Receipt Guidelines</p>
                    <ul className="text-yellow-800 text-sm mt-1 space-y-1">
                      <li>• Receipt should clearly show the date, amount, and vendor</li>
                      <li>• Digital receipts (PDF) are preferred for clarity</li>
                      <li>• Photos should be clear and legible</li>
                      <li>• Expenses without receipts may require additional approval</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
                <p className="text-muted-foreground mb-6">Review your expense details before submission</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Expense Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">Description</Label>
                        <p className="font-medium">{data.description}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Category</Label>
                        <p className="font-medium">{data.category}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Amount</Label>
                        <p className="font-medium text-green-600">AED {parseFloat(data.amount || "0").toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">Date</Label>
                        <p className="font-medium">{data.expense_date}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Billable Status</Label>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{data.is_billable ? "Billable" : "Non-billable"}</p>
                          {data.is_billable && selectedClient && (
                            <span className="text-sm text-muted-foreground">to {selectedClient.name}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Receipt</Label>
                        <p className="font-medium">
                          {data.receipt_file ? `Attached: ${data.receipt_file.name}` : "No receipt attached"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Next Steps</p>
                    <ul className="text-blue-800 text-sm mt-1 space-y-1">
                      <li>• Your expense will be submitted for approval</li>
                      <li>• You'll receive notifications about status updates</li>
                      <li>• Approved expenses are processed in the next payroll cycle</li>
                      <li>• You can track the status in the expenses section</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={data.confirmation}
                  onCheckedChange={(checked) => setData(prev => ({ ...prev, confirmation: checked as boolean }))}
                />
                <Label>I confirm that the expense details above are accurate and I have the right to claim this expense</Label>
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
          {currentStep === 3 ? "Submit Expense" : "Next"}
          {currentStep < 3 && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

export default SubmitExpenseWizard