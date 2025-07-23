import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Users, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Mail,
  Download
} from "lucide-react"
import { useRouter } from "next/navigation"

interface PayslipData {
  payrun_id: string
  language: string
  delivery_method: string
  selected_employees: string[]
  email_subject: string
  confirmation: boolean
}

const GeneratePayslipsWizard = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<PayslipData>({
    payrun_id: "",
    language: "english",
    delivery_method: "email",
    selected_employees: [],
    email_subject: "Your Monthly Payslip - [Month] [Year]",
    confirmation: false
  })

  const payruns = [
    { id: "1", employer: "Emirates Technology LLC", period: "January 2024", status: "Completed", employees: 85 },
    { id: "2", employer: "Al Noor Industries PJSC", period: "January 2024", status: "Locked", employees: 156 },
    { id: "3", employer: "Gulf Trading Company LLC", period: "December 2023", status: "Completed", employees: 42 }
  ]

  const employees = [
    { id: "1", name: "Ahmed Al-Mansouri", email: "ahmed@emirates-tech.ae", net_salary: 20070, language: "English" },
    { id: "2", name: "Sarah Johnson", email: "sarah@emirates-tech.ae", net_salary: 16020, language: "English" },
    { id: "3", name: "Mohammed Hassan", email: "mohammed@alnoor.ae", net_salary: 24120, language: "Arabic" },
    { id: "4", name: "Priya Sharma", email: "priya@gulf-trading.ae", net_salary: 10440, language: "English" }
  ]

  const steps = [
    { id: 1, title: "Select Payrun", description: "Choose completed payrun" },
    { id: 2, title: "Payslip Settings", description: "Configure language and delivery" },
    { id: 3, title: "Select Employees", description: "Choose employees for payslips" },
    { id: 4, title: "Review & Generate", description: "Review and generate payslips" }
  ]

  const selectedPayrun = payruns.find(p => p.id === data.payrun_id)
  const selectedEmployees = employees.filter(e => data.selected_employees.includes(e.id))

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Generate payslips
      navigate("/payroll/payslips")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.payrun_id !== ""
      case 2: return data.language !== "" && data.delivery_method !== ""
      case 3: return data.selected_employees.length > 0
      case 4: return data.confirmation
      default: return false
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Payslips</h1>
          <p className="text-muted-foreground">
            Create and distribute employee payslips from completed payruns
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/payroll/payslips")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payslips
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
                <h3 className="text-lg font-semibold mb-4">Select Payrun</h3>
                <p className="text-muted-foreground mb-6">Choose a completed payrun to generate payslips from</p>
              </div>
              
              <div className="grid gap-4">
                {payruns.map((payrun) => (
                  <div 
                    key={payrun.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      data.payrun_id === payrun.id 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setData(prev => ({ ...prev, payrun_id: payrun.id }))}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{payrun.employer}</h4>
                          <p className="text-sm text-muted-foreground">{payrun.period} • {payrun.employees} employees</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={payrun.status === "Completed" ? "default" : "secondary"}>
                          {payrun.status}
                        </Badge>
                        {data.payrun_id === payrun.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Payslip Settings</h3>
                <p className="text-muted-foreground mb-6">Configure language and delivery preferences</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Language</Label>
                    <p className="text-sm text-muted-foreground mb-3">Select the default language for payslips</p>
                    <RadioGroup 
                      value={data.language} 
                      onValueChange={(value) => setData(prev => ({ ...prev, language: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="english" id="english" />
                        <Label htmlFor="english">English</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="arabic" id="arabic" />
                        <Label htmlFor="arabic">Arabic</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mixed" id="mixed" />
                        <Label htmlFor="mixed">Mixed (based on employee preference)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Delivery Method</Label>
                    <p className="text-sm text-muted-foreground mb-3">How should payslips be delivered?</p>
                    <RadioGroup 
                      value={data.delivery_method} 
                      onValueChange={(value) => setData(prev => ({ ...prev, delivery_method: value }))}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="email" />
                        <Label htmlFor="email">Email to employees</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="download" id="download" />
                        <Label htmlFor="download">Download only (manual distribution)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="both" />
                        <Label htmlFor="both">Both email and download</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {selectedPayrun && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Selected Payrun</p>
                      <p className="text-blue-700">{selectedPayrun.employer} - {selectedPayrun.period}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Employees</h3>
                <p className="text-muted-foreground mb-6">Choose employees to generate payslips for</p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setData(prev => ({ 
                      ...prev, 
                      selected_employees: employees.map(e => e.id) 
                    }))}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setData(prev => ({ ...prev, selected_employees: [] }))}
                  >
                    Clear All
                  </Button>
                </div>
                <Badge variant="secondary">
                  {data.selected_employees.length} of {employees.length} selected
                </Badge>
              </div>

              <div className="grid gap-3">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      checked={data.selected_employees.includes(employee.id)}
                      onCheckedChange={(checked) => {
                        setData(prev => ({
                          ...prev,
                          selected_employees: checked
                            ? [...prev.selected_employees, employee.id]
                            : prev.selected_employees.filter(id => id !== employee.id)
                        }))
                      }}
                    />
                    <Users className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">AED {employee.net_salary.toLocaleString()}</p>
                          <Badge variant="outline" className="text-xs">{employee.language}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review & Generate</h3>
                <p className="text-muted-foreground mb-6">Review the payslip generation details</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generation Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payrun:</span>
                      <span className="font-medium">{selectedPayrun?.employer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Period:</span>
                      <span className="font-medium">{selectedPayrun?.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language:</span>
                      <span className="font-medium capitalize">{data.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery:</span>
                      <span className="font-medium capitalize">{data.delivery_method}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Employee Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Employees:</span>
                      <span className="font-medium">{selectedEmployees.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Net Pay:</span>
                      <span className="font-medium text-green-600">
                        AED {selectedEmployees.reduce((sum, emp) => sum + emp.net_salary, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <Badge variant="outline">PDF</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Generation Process</p>
                    <ul className="text-yellow-800 text-sm mt-1 space-y-1">
                      <li>• Payslips will be generated in PDF format</li>
                      <li>• {data.delivery_method === "email" ? "Emails will be sent automatically to selected employees" : 
                           data.delivery_method === "download" ? "Files will be prepared for download" :
                           "Emails will be sent and files prepared for download"}</li>
                      <li>• You can track delivery status in the payslips section</li>
                      <li>• Payslips can be regenerated if needed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={data.confirmation}
                  onCheckedChange={(checked) => setData(prev => ({ ...prev, confirmation: checked as boolean }))}
                />
                <Label>I confirm that I want to generate payslips with the above settings</Label>
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
          {currentStep === 4 ? (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Payslips
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default GeneratePayslipsWizard