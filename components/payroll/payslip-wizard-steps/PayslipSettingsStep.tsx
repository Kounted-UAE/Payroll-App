// componentskounted-payrollsteps/PayslipSettingsStep.tsx

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/react-ui/card'
import { Label } from '@/components/react-ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/react-ui/radio-group'
import { Input } from '@/components/react-ui/input'
import { Badge } from '@/components/react-ui/badge'
import { Globe, Mail, Download, Languages } from 'lucide-react'

interface PayslipSettingsData {
  language: 'english' | 'arabic' | 'mixed'
  delivery_mode: 'download' | 'email' | 'both'
  email_subject: string
}

interface PayslipSettingsStepProps {
  data: PayslipSettingsData
  onChange: (updates: Partial<PayslipSettingsData>) => void
}

export function PayslipSettingsStep({ data, onChange }: PayslipSettingsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Payslip Settings</h3>
        <p className="text-zinc-400">
          Configure language preferences and delivery options for the payslips
        </p>
      </div>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Languages className="h-4 w-4" />
            <span>Language Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Payslip Language</Label>
            <p className="text-sm text-zinc-400 mb-3">
              Choose the language for generated payslips
            </p>
            <RadioGroup 
              value={data.language} 
              onValueChange={(value: 'english' | 'arabic' | 'mixed') => onChange({ language: value })}
            >
              <div className="grid gap-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-zinc-100/50">
                  <RadioGroupItem value="english" id="english" />
                  <Label htmlFor="english" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">English</div>
                        <div className="text-sm text-zinc-400">Generate payslips in English only</div>
                      </div>
                      <Badge variant="outline">EN</Badge>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-zinc-100/50">
                  <RadioGroupItem value="arabic" id="arabic" />
                  <Label htmlFor="arabic" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Arabic</div>
                        <div className="text-sm text-zinc-400">Generate payslips in Arabic only</div>
                      </div>
                      <Badge variant="outline">عربي</Badge>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-zinc-100/50">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Mixed (Bilingual)</div>
                        <div className="text-sm text-zinc-400">Generate payslips in both English and Arabic</div>
                      </div>
                      <Badge variant="outline">EN/عربي</Badge>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Delivery Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">How should payslips be delivered?</Label>
            <p className="text-sm text-zinc-400 mb-3">
              Choose the delivery method for the generated payslips
            </p>
            <RadioGroup 
              value={data.delivery_mode} 
              onValueChange={(value: 'download' | 'email' | 'both') => onChange({ delivery_mode: value })}
            >
              <div className="grid gap-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-zinc-100/50">
                  <RadioGroupItem value="download" id="download" />
                  <Label htmlFor="download" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Download Only</div>
                        <div className="text-sm text-zinc-400">Generate PDF files for manual distribution</div>
                      </div>
                      <Download className="h-4 w-4 text-zinc-600" />
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-zinc-100/50">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email to Employees</div>
                        <div className="text-sm text-zinc-400">Send payslips directly to employee email addresses</div>
                      </div>
                      <Mail className="h-4 w-4 text-zinc-600" />
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-zinc-100/50">
                  <RadioGroupItem value="both" id="both" />
                  <Label htmlFor="both" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Both Download and Email</div>
                        <div className="text-sm text-zinc-400">Generate files and send emails to employees</div>
                      </div>
                      <div className="flex space-x-1">
                        <Download className="h-4 w-4 text-zinc-600" />
                        <Mail className="h-4 w-4 text-zinc-600" />
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Email Subject (only show if email is selected) */}
          {(data.delivery_mode === 'email' || data.delivery_mode === 'both') && (
            <div className="space-y-2">
              <Label htmlFor="email-subject">Email Subject Line</Label>
              <Input
                id="email-subject"
                value={data.email_subject}
                onChange={(e) => onChange({ email_subject: e.target.value })}
                placeholder="Enter email subject line..."
              />
              <p className="text-xs text-zinc-400">
                This subject will be used for all payslip emails sent to employees
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Summary */}
      <Card className="border-zinc-400 bg-zinc-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center">
                <Globe className="h-4 w-4 text-zinc-600" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-zinc-900">Settings Summary</h4>
              <div className="text-sm text-zinc-700 mt-1 space-y-1">
                <p>• Language: <Badge variant="outline" className="ml-1">
                  {data.language === 'english' ? 'English' : 
                   data.language === 'arabic' ? 'Arabic' : 'Bilingual'}
                </Badge></p>
                <p>• Delivery: <Badge variant="outline" className="ml-1">
                  {data.delivery_mode === 'download' ? 'Download Only' :
                   data.delivery_mode === 'email' ? 'Email Only' : 'Download + Email'}
                </Badge></p>
                {(data.delivery_mode === 'email' || data.delivery_mode === 'both') && (
                  <p>• Email Subject: "{data.email_subject}"</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 