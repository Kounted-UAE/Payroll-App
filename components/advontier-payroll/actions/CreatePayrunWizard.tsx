'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  ArrowRight, 
  Building, 
  Calendar, 
  Users, 
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from '@supabase/supabase-js';

interface PayrunData {
  employer_id: string
  pay_period_start: string
  pay_period_end: string
  payroll_month: string
  selected_employees: string[]
  confirmation: boolean
}

// Function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  return createClient(supabaseUrl, supabaseKey)
}

const CreatePayrunWizard = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<PayrunData>({
    employer_id: "",
    pay_period_start: "",
    pay_period_end: "",
    payroll_month: "",
    selected_employees: [],
    confirmation: false
  })

  const [employers, setEmployers] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployers = async () => {
      const { data, error } = await supabase.from('core_objects_entities').select('id, name');
      if (!error) setEmployers(data || []);
    };
    fetchEmployers();
  }, []);

  useEffect(() => {
    if (data.employer_id) {
      const fetchEmployees = async () => {
        const { data: empData, error } = await supabase
          .from('core_objects_employees')
          .select('id, name, basic_salary, status')
          .eq('employer_id', data.employer_id);
        if (!error) setEmployees(empData || []);
      };
      fetchEmployees();
    }
  }, [data.employer_id]);

  const steps = [
    { id: 1, title: "Select Employer", description: "Choose the employer company" },
    { id: 2, title: "Pay Period", description: "Set the payroll period dates" },
    { id: 3, title: "Select Employees", description: "Choose employees to include" },
    { id: 4, title: "Review & Create", description: "Review and create payrun" }
  ]

  const selectedEmployer = employers.find(e => e.id === data.employer_id)
  const selectedEmployees = employees.filter(e => data.selected_employees.includes(e.id))
  const totalGrossPay = selectedEmployees.reduce((sum, emp) => sum + emp.basic_salary, 0)

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      setLoading(true);
      const { data: payrun, error } = await supabase
        .from('payruns')
        .insert([{
          employer_id: data.employer_id,
          pay_period_start: data.pay_period_start,
          pay_period_end: data.pay_period_end,
          payroll_month: data.payroll_month,
          status: 'Draft'
        }])
        .select()
        .single();
      if (error) {
        setLoading(false);
        // handle error
        return;
      }
      const payrunEmployees = data.selected_employees.map((empId: string) => ({
        payrun_id: payrun.id,
        employee_id: empId
      }));
      await supabase.from('payrun_employees').insert(payrunEmployees);
      setLoading(false);
      router.push("/advontier/payroll/payruns");
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.employer_id !== ""
      case 2: return data.pay_period_start !== "" && data.pay_period_end !== ""
      case 3: return data.selected_employees.length > 0
      case 4: return data.confirmation
      default: return false
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg text-zinc-600 font-bold">Create New Payrun</h1>
          <p className="text-blue-400">
            Set up a new payroll run for processing employee salaries
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/advontier/payroll/payruns")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payruns
        </Button>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step.id ? "text-blue-500" : "text-blue-200"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep >= step.id ? "bg-blue-500 text-blue-500-foreground" : "bg-blue-100"
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                  </div>
                  <div>
                    <p className="font-medium">{step.title}</p>
                    <p className="text-xs text-blue-200">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-px w-20 mx-4 ${
                    currentStep > step.id ? "bg-blue-500" : "bg-blue-100"
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
                <h3 className="text-xs font-semibold mb-4">Select Employer Company</h3>
                <p className="text-blue-200 mb-6">Choose the employer for this payrun</p>
              </div>
              
              <div className="grid gap-4">
                {employers.map((employer) => (
                  <div 
                    key={employer.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      data.employer_id === employer.id 
                        ? "border-blue-500 bg-blue-500/5" 
                        : "border-border hover:border-blue-500/50"
                    }`}
                    onClick={() => setData(prev => ({ ...prev, employer_id: employer.id }))}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{employer.name}</h4>
                          <p className="text-xs text-blue-200">{employer.employees} employees</p>
                        </div>
                      </div>
                      {data.employer_id === employer.id && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold mb-4">Set Pay Period</h3>
                <p className="text-blue-200 mb-6">Define the payroll period dates</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="payroll_month">Payroll Month</Label>
                  <Select value={data.payroll_month} onValueChange={(value) => 
                    setData(prev => ({ ...prev, payroll_month: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-01">January 2024</SelectItem>
                      <SelectItem value="2024-02">February 2024</SelectItem>
                      <SelectItem value="2024-03">March 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Selected Employer</Label>
                  <div className="p-3 bg-blue-100 rounded-md">
                    <p className="font-medium">{selectedEmployer?.name}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Period Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={data.pay_period_start}
                    onChange={(e) => setData(prev => ({ ...prev, pay_period_start: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_date">Period End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={data.pay_period_end}
                    onChange={(e) => setData(prev => ({ ...prev, pay_period_end: e.target.value }))}
                  />
                </div>
              </div>

              {data.pay_period_start && data.pay_period_end && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Pay Period Summary</p>
                      <p className="text-blue-700">
                        {data.pay_period_start} to {data.pay_period_end}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold mb-4">Select Employees</h3>
                <p className="text-blue-200 mb-6">Choose employees to include in this payrun</p>
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
                  <div key={employee.id} className="flex items-center space-x-3 p-3 border rounded-lg">
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
                    <Users className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-blue-200">Basic Salary: AED {employee.basic_salary.toLocaleString()}</p>
                        </div>
                        <Badge variant="outline">{employee.status}</Badge>
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
                <h3 className="text-xs font-semibold mb-4">Review & Confirm</h3>
                <p className="text-blue-200 mb-6">Review the payrun details before creation</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xs">Payrun Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Employer:</span>
                      <span className="font-medium">{selectedEmployer?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Pay Period:</span>
                      <span className="font-medium">{data.pay_period_start} - {data.pay_period_end}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Month:</span>
                      <span className="font-medium">{data.payroll_month}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xs">Employee Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Total Employees:</span>
                      <span className="font-medium">{selectedEmployees.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Estimated Gross:</span>
                      <span className="font-medium text-blue-500">AED {totalGrossPay.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Status:</span>
                      <Badge variant="outline">Draft</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Important Notes</p>
                    <ul className="text-yellow-800 text-xs mt-1 space-y-1">
                      <li>• The payrun will be created in draft status</li>
                      <li>• You can edit employee selections before processing</li>
                      <li>• Salary calculations will be based on current salary structures</li>
                      <li>• EOSB accruals will be automatically calculated</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={data.confirmation}
                  onCheckedChange={(checked) => setData(prev => ({ ...prev, confirmation: checked as boolean }))}
                />
                <Label>I confirm that the above details are correct and want to create this payrun</Label>
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
          <span className="text-xs text-blue-200">
            Step {currentStep} of {steps.length}
          </span>
        </div>

        <Button
          onClick={handleNext}
          disabled={!canProceed() || loading}
        >
          {loading ? "Saving..." : (currentStep === 4 ? "Create Payrun" : "Next")}
          {currentStep < 4 && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}

export default CreatePayrunWizard