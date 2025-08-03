// advontier-payrollsteps/ReviewGenerateStep.tsx

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  FileText, 
  Users, 
  DollarSign, 
  Globe, 
  Mail, 
  Download, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Settings,
  Eye,
  Send
} from 'lucide-react'
import { useState } from 'react'
import { generatePayslipPDF } from '@/lib/utils/pdf/generatePayslipPDF'
import { generateZip } from '@/lib/utils/pdf/generateZip'
import { sendPayslipEmail } from '@/lib/utils/email/sendPayslipEmail'
import { toast } from '@/hooks/use-toast'

interface ReviewGenerateStepProps {
  batchData: {
    batch_id: string
    employer_name: string
    pay_period_from: string
    pay_period_to: string
    total_employees: number
    total_salary: number
    currency: string
  }
  wizardData: {
    language: 'english' | 'arabic' | 'mixed'
    delivery_mode: 'download' | 'email' | 'both'
    selected_employees: string[]
    email_subject: string
    confirmation: boolean
  }
  employees: any[]
  onConfirmationChange: (confirmed: boolean) => void
  onGenerate: () => Promise<void>
  loading: boolean
}

export function ReviewGenerateStep({
  batchData,
  wizardData,
  employees,
  onConfirmationChange,
  onGenerate,
  loading
}: ReviewGenerateStepProps) {
  const [showTestOptions, setShowTestOptions] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testLoading, setTestLoading] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'AED'
    }).format(amount)
  }

  const totalSelectedSalary = employees.reduce((sum, emp) => sum + (emp.total_salary || 0), 0)

  const getLanguageLabel = (language: string) => {
    switch (language) {
      case 'english': return 'English'
      case 'arabic': return 'Arabic'
      case 'mixed': return 'Bilingual (English + Arabic)'
      default: return language
    }
  }

  const getDeliveryLabel = (mode: string) => {
    switch (mode) {
      case 'download': return 'Download Only'
      case 'email': return 'Email to Employees'
      case 'both': return 'Download + Email'
      default: return mode
    }
  }

  const handleDownloadPreview = async () => {
    if (employees.length === 0) return
    
    setPreviewLoading(true)
    try {
      const firstEmployee = employees[0]
      const pdfBlob = await generatePayslipPDF({
        employee: firstEmployee,
        batchData,
        language: wizardData.language
      })
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payslip-preview-${firstEmployee.employee_name.replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({
        title: 'Preview Downloaded',
        description: 'Single payslip preview has been downloaded',
      })
    } catch (error) {
      console.error('Error generating preview:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate preview PDF',
        variant: 'destructive',
      })
    } finally {
      setPreviewLoading(false)
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmail || employees.length === 0) return
    
    setTestLoading(true)
    try {
      const firstEmployee = employees[0]
      const pdfBlob = await generatePayslipPDF({
        employee: firstEmployee,
        batchData,
        language: wizardData.language
      })
      
      await sendPayslipEmail({
        to: testEmail,
        subject: `[TEST] ${wizardData.email_subject}`,
        employeeName: firstEmployee.employee_name,
        pdfBlob,
        employerName: batchData.employer_name,
        payPeriodFrom: batchData.pay_period_from,
        payPeriodTo: batchData.pay_period_to,
        language: wizardData.language
      })
      
      toast({
        title: 'Test Email Sent',
        description: `Test payslip sent to ${testEmail}`,
      })
    } catch (error) {
      console.error('Error sending test email:', error)
      toast({
        title: 'Error',
        description: 'Failed to send test email',
        variant: 'destructive',
      })
    } finally {
      setTestLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review & Generate Payslips</h3>
        <p className="text-muted-foreground">
          Review your settings and generate payslips for the selected employees
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Batch ID</p>
                <p className="text-lg font-bold font-mono">{batchData.batch_id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Employees</p>
                <p className="text-lg font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-lg font-bold">{getLanguageLabel(wizardData.language)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Total Salary</p>
                <p className="text-lg font-bold">
                  {formatCurrency(totalSelectedSalary, batchData.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Review */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Batch Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employer:</span>
              <span className="font-medium">{batchData.employer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pay Period:</span>
              <span className="font-medium">
                {formatDate(batchData.pay_period_from)} - {formatDate(batchData.pay_period_to)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Currency:</span>
              <Badge variant="outline">{batchData.currency}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Generation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Generation Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Language:</span>
              <Badge variant="outline">{getLanguageLabel(wizardData.language)}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery:</span>
              <Badge variant="outline">{getDeliveryLabel(wizardData.delivery_mode)}</Badge>
            </div>
            {(wizardData.delivery_mode === 'email' || wizardData.delivery_mode === 'both') && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email Subject:</span>
                <span className="font-medium text-sm max-w-xs truncate">{wizardData.email_subject}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span>Test Options</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Preview and Test</p>
              <p className="text-sm text-muted-foreground">
                Test the payslip generation before processing all employees
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowTestOptions(!showTestOptions)}
            >
              {showTestOptions ? 'Hide' : 'Show'} Test Options
            </Button>
          </div>

          {showTestOptions && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-email">Test Email Address</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      id="test-email"
                      type="email"
                      placeholder="test@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                    <Button
                      size="sm"
                      onClick={handleSendTestEmail}
                      disabled={!testEmail || testLoading}
                    >
                      {testLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Send a test payslip to verify email delivery
                  </p>
                </div>

                <div>
                  <Label>Preview Payslip</Label>
                  <div className="mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadPreview}
                      disabled={previewLoading || employees.length === 0}
                    >
                      {previewLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      Download Preview
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Download a sample payslip for review
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Process Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Generation Process</h4>
              <ul className="text-blue-800 text-sm mt-1 space-y-1">
                <li>• Payslips will be generated in PDF format</li>
                <li>• {wizardData.delivery_mode === 'email' ? 'Emails will be sent automatically to selected employees' : 
                     wizardData.delivery_mode === 'download' ? 'Files will be prepared for download' :
                     'Emails will be sent and files prepared for download'}</li>
                <li>• You can track delivery status in the payslips section</li>
                <li>• Payslips can be regenerated if needed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={wizardData.confirmation}
              onCheckedChange={(checked) => onConfirmationChange(checked as boolean)}
            />
            <Label className="text-sm">
              I confirm that I want to generate payslips with the above settings for {employees.length} employees
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={onGenerate}
          disabled={!wizardData.confirmation || loading}
          className="min-w-[200px]"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Payslips...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-5 w-5" />
              Generate Payslips
            </>
          )}
        </Button>
      </div>
    </div>
  )
} 