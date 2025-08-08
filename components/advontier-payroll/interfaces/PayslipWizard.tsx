// componentsadvontier-payrollPayslipWizard.tsx

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Check, FileText, Users, Settings, Eye } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

// Import step components
import { BatchOverviewStep } from '../steps/BatchOverviewStep'
import { PayslipSettingsStep } from '../steps/PayslipSettingsStep'
import { EmployeeSelectionStep } from '../steps/EmployeeSelectionStep'
import { ReviewGenerateStep } from '../steps/ReviewGenerateStep'

// Add these imports at the top
import { generatePayslipPDF } from '@/lib/utils/pdf/generatePayslipPDF'
import { createPayslipsZip } from '@/lib/utils/pdf/generateZip'
import { sendBatchPayslipEmails } from '@/lib/utils/email/sendPayslipEmail'

const STEPS = [
  { id: 1, title: 'Batch Overview', icon: FileText, description: 'Review batch details' },
  { id: 2, title: 'Payslip Settings', icon: Settings, description: 'Configure language and delivery' },
  { id: 3, title: 'Select Employees', icon: Users, description: 'Choose employees for payslips' },
  { id: 4, title: 'Review & Generate', icon: Eye, description: 'Final review and generation' }
]

interface BatchData {
  batch_id: string
  employer_name: string
  pay_period_from: string
  pay_period_to: string
  total_employees: number
  total_salary: number
  currency: string
}

interface PayslipWizardData {
  language: 'english' | 'arabic' | 'mixed'
  delivery_mode: 'download' | 'email' | 'both'
  selected_employees: string[]
  email_subject: string
  confirmation: boolean
}

interface PayslipWizardProps {
  batchData: BatchData
}

export function PayslipWizard({ batchData }: PayslipWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [wizardData, setWizardData] = useState<PayslipWizardData>({
    language: 'english',
    delivery_mode: 'email',
    selected_employees: [],
    email_subject: `Your Payslip - ${batchData.employer_name} - ${batchData.pay_period_from} to ${batchData.pay_period_to}`,
    confirmation: false
  })

  // Fetch employees for this batch
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from('payroll_ingest_excelpayrollimport')
          .select('*')
          .eq('batch_id', batchData.batch_id)
          .order('employee_name')

        if (error) throw error

        setEmployees(data || [])
        // Auto-select all employees by default
        setWizardData(prev => ({
          ...prev,
          selected_employees: data?.map(emp => emp.id) || []
        }))
      } catch (err) {
        console.error('Error fetching employees:', err)
        toast({
          title: 'Error',
          description: 'Failed to load employee data',
          variant: 'destructive',
        })
      }
    }

    fetchEmployees()
  }, [batchData.batch_id])

  const updateWizardData = (updates: Partial<PayslipWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }))
  }

  const markStepComplete = (stepId: number) => {
    setCompletedSteps(prev => new Set([...prev, stepId]))
  }

  const goToNextStep = () => {
    if (currentStep < STEPS.length) {
      markStepComplete(currentStep)
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepId: number) => {
    setCurrentStep(stepId)
  }

  const getStepStatus = (stepId: number) => {
    if (completedSteps.has(stepId)) return 'complete'
    if (stepId === currentStep) return 'current'
    if (stepId < currentStep) return 'visited'
    return 'pending'
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true // Always can proceed from overview
      case 2: return wizardData.language && wizardData.delivery_mode
      case 3: return wizardData.selected_employees.length > 0
      case 4: return wizardData.confirmation
      default: return false
    }
  }

  const progress = (currentStep / STEPS.length) * 100

  return (
    <div className="max-w-6xl mx-auto bg-zinc-100">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Payslip Generation Steps</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {STEPS.map((step) => {
                  const status = getStepStatus(step.id)
                  const Icon = step.icon
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => goToStep(step.id)}
                      className={`w-full text-left p-3 rounded-none border-l-2 transition-colors ${
                        status === 'complete'
                          ? 'border-l-blue-500 bg-blue-500/5 text-blue-500'
                          : status === 'current'
                          ? 'border-l-blue-500 bg-blue-500/10 text-blue-500 font-medium'
                          : status === 'visited'
                          ? 'border-l-muted-foreground bg-muted/30 text-foreground'
                          : 'border-l-transparent hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {status === 'complete' && <Check className="h-4 w-4" />}
                        <Icon className="h-4 w-4" />
                        <div className="flex-1">
                          <div className="text-xs font-medium">{step.id}. {step.title}</div>
                          <div className="text-xs text-muted-foreground">{step.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Step {currentStep}: {STEPS.find(s => s.id === currentStep)?.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {STEPS.find(s => s.id === currentStep)?.description}
                  </p>
                </div>
                {completedSteps.has(currentStep) && (
                  <Badge variant="default" className="gap-1">
                    <Check className="h-3 w-3" />
                    Complete
                  </Badge>
                )}
              </div>
              <Progress value={progress} className="mt-4" />
            </CardHeader>
            <CardContent className="p-6">
              {/* Step Content */}
              {currentStep === 1 && (
                <BatchOverviewStep 
                  batchData={batchData}
                  employees={employees}
                />
              )}
              
              {currentStep === 2 && (
                <PayslipSettingsStep
                  data={wizardData}
                  onChange={updateWizardData}
                />
              )}
              
              {currentStep === 3 && (
                <EmployeeSelectionStep
                  employees={employees}
                  selectedEmployees={wizardData.selected_employees}
                  onSelectionChange={(selected) => updateWizardData({ selected_employees: selected })}
                />
              )}
              
              {currentStep === 4 && (
                <ReviewGenerateStep
                  batchData={batchData}
                  wizardData={wizardData}
                  employees={employees.filter(emp => wizardData.selected_employees.includes(emp.id))}
                  onConfirmationChange={(confirmed) => updateWizardData({ confirmation: confirmed })}
                  onGenerate={async () => {
                    setLoading(true)
                    try {
                      const selectedEmployees = employees.filter(emp => wizardData.selected_employees.includes(emp.id))
                      
                      // Generate PDFs for all selected employees
                      const payslips = []
                      for (const employee of selectedEmployees) {
                        const pdfBlob = await generatePayslipPDF({
                          employee,
                          batchData,
                          language: wizardData.language
                        })
                        payslips.push({
                          employeeName: employee.employee_name,
                          pdfBlob
                        })
                      }

                      // Handle delivery based on selected mode
                      if (wizardData.delivery_mode === 'download' || wizardData.delivery_mode === 'both') {
                        // Create and download ZIP file
                        const zipBlob = await createPayslipsZip(payslips)
                        
                        // Download the ZIP file
                        const url = URL.createObjectURL(zipBlob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `payslips-${batchData.batch_id}-${new Date().toISOString().split('T')[0]}.zip`
                        document.body.appendChild(a)
                        a.click()
                        document.body.removeChild(a)
                        URL.revokeObjectURL(url)
                      }

                      if (wizardData.delivery_mode === 'email' || wizardData.delivery_mode === 'both') {
                        // Send emails to employees
                        const emailData = selectedEmployees.map((employee, index) => {
                          if (!employee.email_id) {
                            return null // Skip employees without email
                          }
                          
                          return {
                            to: employee.email_id,
                            subject: wizardData.email_subject,
                            employeeName: employee.employee_name,
                            pdfBlob: payslips[index].pdfBlob,
                            employerName: batchData.employer_name,
                            payPeriodFrom: batchData.pay_period_from,
                            payPeriodTo: batchData.pay_period_to,
                            language: wizardData.language === 'mixed' ? 'english' : wizardData.language
                          }
                        }).filter(Boolean) // Remove null entries

                        if (emailData.length > 0) {
                          const emailResults = await sendBatchPayslipEmails(emailData)
                          const successCount = emailResults.filter(r => r.success).length
                          const failureCount = emailResults.filter(r => !r.success).length

                          if (failureCount > 0) {
                            toast({
                              title: 'Partial Success',
                              description: `${successCount} emails sent successfully, ${failureCount} failed`,
                              variant: 'default',
                            })
                          } else {
                            toast({
                              title: 'Success',
                              description: `All ${successCount} payslip emails sent successfully!`,
                            })
                          }
                        }
                      }

                      toast({
                        title: 'Payslips Generated',
                        description: `Successfully generated ${selectedEmployees.length} payslips`,
                      })

                    } catch (error) {
                      console.error('Error generating payslips:', error)
                      toast({
                        title: 'Error',
                        description: 'Failed to generate payslips. Please try again.',
                        variant: 'destructive',
                      })
                    } finally {
                      setLoading(false)
                    }
                  }}
                  loading={loading}
                />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    Step {currentStep} of {STEPS.length}
                  </span>
                </div>

                <Button
                  onClick={goToNextStep}
                  disabled={!canProceed() || loading}
                >
                  {currentStep === 4 ? (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Payslips
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 