
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, Check, Building, MapPin, CreditCard, Users, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddEmployerWizardProps {
  onComplete: (employerData: any) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Company Details', icon: Building },
  { id: 2, title: 'Address & Contact', icon: MapPin },
  { id: 3, title: 'WPS Setup', icon: CreditCard },
  { id: 4, title: 'Role Assignment', icon: Users }
];

export default function AddEmployerWizard({ onComplete, onCancel }: AddEmployerWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Company Details
    legal_name: '',
    trade_name: '',
    trade_license_number: '',
    jurisdiction: '',
    license_expiry: '',
    business_type: '',
    establishment_card: '',
    mohre_establishment_id: '',
    
    // Address & Contact
    address_line_1: '',
    address_line_2: '',
    city: '',
    emirate: '',
    po_box: '',
    phone_number: '',
    fax_number: '',
    email_address: '',
    website: '',
    contact_person_name: '',
    contact_person_title: '',
    contact_person_phone: '',
    contact_person_email: '',
    
    // WPS Setup
    bank_name: '',
    bank_code: '',
    routing_code: '',
    company_account_number: '',
    company_iban: '',
    wps_registered: false,
    wps_employer_id: '',
    salary_transfer_method: 'WPS',
    
    // Role Assignment
    admin_users: [],
    payroll_officers: [],
    hr_managers: []
  });

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.legal_name && formData.trade_license_number && formData.jurisdiction);
      case 2:
        return !!(formData.address_line_1 && formData.city && formData.emirate && formData.contact_person_name);
      case 3:
        return !!(formData.bank_name && formData.company_iban);
      case 4:
        return true; // Role assignment is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
    }
  };

  const handleComplete = () => {
    toast({
      title: "Success",
      description: "Employer added successfully"
    });
    onComplete(formData);
  };

  const progress = (currentStep / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="legal_name">Legal Company Name *</Label>
                <Input
                  id="legal_name"
                  value={formData.legal_name}
                  onChange={(e) => updateField('legal_name', e.target.value)}
                  placeholder="Emirates Technology LLC"
                  required
                />
              </div>
              <div>
                <Label htmlFor="trade_name">Trade Name</Label>
                <Input
                  id="trade_name"
                  value={formData.trade_name}
                  onChange={(e) => updateField('trade_name', e.target.value)}
                  placeholder="ETech Solutions"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="trade_license_number">Trade License Number *</Label>
                <Input
                  id="trade_license_number"
                  value={formData.trade_license_number}
                  onChange={(e) => updateField('trade_license_number', e.target.value)}
                  placeholder="CN-1234567"
                  required
                />
              </div>
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                <Select value={formData.jurisdiction} onValueChange={(value) => updateField('jurisdiction', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DED">Dubai Economy (DED)</SelectItem>
                    <SelectItem value="ADCCI">Abu Dhabi Chamber</SelectItem>
                    <SelectItem value="SCCI">Sharjah Chamber</SelectItem>
                    <SelectItem value="AJCCI">Ajman Chamber</SelectItem>
                    <SelectItem value="RAKCCI">RAK Chamber</SelectItem>
                    <SelectItem value="FUCCI">Fujairah Chamber</SelectItem>
                    <SelectItem value="UAQCCI">UAQ Chamber</SelectItem>
                    <SelectItem value="DIFC">DIFC</SelectItem>
                    <SelectItem value="ADGM">ADGM</SelectItem>
                    <SelectItem value="JAFZA">JAFZA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="license_expiry">License Expiry Date</Label>
                <Input
                  id="license_expiry"
                  type="date"
                  value={formData.license_expiry}
                  onChange={(e) => updateField('license_expiry', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business_type">Business Type</Label>
                <Select value={formData.business_type} onValueChange={(value) => updateField('business_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LLC">Limited Liability Company (LLC)</SelectItem>
                    <SelectItem value="PJSC">Public Joint Stock Company (PJSC)</SelectItem>
                    <SelectItem value="PSJC">Private Joint Stock Company (PSJC)</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="Branch">Branch Office</SelectItem>
                    <SelectItem value="Representative">Representative Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="establishment_card">Establishment Card Number</Label>
                <Input
                  id="establishment_card"
                  value={formData.establishment_card}
                  onChange={(e) => updateField('establishment_card', e.target.value)}
                  placeholder="EC-123456789"
                />
              </div>
              <div>
                <Label htmlFor="mohre_establishment_id">MoHRE Establishment ID</Label>
                <Input
                  id="mohre_establishment_id"
                  value={formData.mohre_establishment_id}
                  onChange={(e) => updateField('mohre_establishment_id', e.target.value)}
                  placeholder="MID-987654321"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Document Upload</h4>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Please upload the following documents (PDF format recommended):
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>• Trade License Copy</div>
                <div>• Establishment Card</div>
                <div>• MoHRE Registration</div>
                <div>• Bank Certificate</div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-4">Company Address</h4>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <Label htmlFor="address_line_1">Address Line 1 *</Label>
                  <Input
                    id="address_line_1"
                    value={formData.address_line_1}
                    onChange={(e) => updateField('address_line_1', e.target.value)}
                    placeholder="Office 501, ABC Tower"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address_line_2">Address Line 2</Label>
                  <Input
                    id="address_line_2"
                    value={formData.address_line_2}
                    onChange={(e) => updateField('address_line_2', e.target.value)}
                    placeholder="Sheikh Zayed Road"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Dubai"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emirate">Emirate *</Label>
                  <Select value={formData.emirate} onValueChange={(value) => updateField('emirate', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emirate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dubai">Dubai</SelectItem>
                      <SelectItem value="Abu Dhabi">Abu Dhabi</SelectItem>
                      <SelectItem value="Sharjah">Sharjah</SelectItem>
                      <SelectItem value="Ajman">Ajman</SelectItem>
                      <SelectItem value="Ras Al Khaimah">Ras Al Khaimah</SelectItem>
                      <SelectItem value="Fujairah">Fujairah</SelectItem>
                      <SelectItem value="Umm Al Quwain">Umm Al Quwain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="po_box">P.O. Box</Label>
                  <Input
                    id="po_box"
                    value={formData.po_box}
                    onChange={(e) => updateField('po_box', e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone_number">Phone Number</Label>
                  <Input
                    id="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => updateField('phone_number', e.target.value)}
                    placeholder="+971 4 123 4567"
                  />
                </div>
                <div>
                  <Label htmlFor="fax_number">Fax Number</Label>
                  <Input
                    id="fax_number"
                    value={formData.fax_number}
                    onChange={(e) => updateField('fax_number', e.target.value)}
                    placeholder="+971 4 123 4568"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="email_address">Email Address</Label>
                  <Input
                    id="email_address"
                    type="email"
                    value={formData.email_address}
                    onChange={(e) => updateField('email_address', e.target.value)}
                    placeholder="info@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="www.company.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Primary Contact Person *</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_person_name">Full Name *</Label>
                  <Input
                    id="contact_person_name"
                    value={formData.contact_person_name}
                    onChange={(e) => updateField('contact_person_name', e.target.value)}
                    placeholder="Ahmed Al-Mansouri"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person_title">Job Title</Label>
                  <Input
                    id="contact_person_title"
                    value={formData.contact_person_title}
                    onChange={(e) => updateField('contact_person_title', e.target.value)}
                    placeholder="HR Manager"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="contact_person_phone">Phone Number</Label>
                  <Input
                    id="contact_person_phone"
                    value={formData.contact_person_phone}
                    onChange={(e) => updateField('contact_person_phone', e.target.value)}
                    placeholder="+971 50 123 4567"
                  />
                </div>
                <div>
                  <Label htmlFor="contact_person_email">Email Address</Label>
                  <Input
                    id="contact_person_email"
                    type="email"
                    value={formData.contact_person_email}
                    onChange={(e) => updateField('contact_person_email', e.target.value)}
                    placeholder="ahmed@company.com"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-4">Banking Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bank_name">Bank Name *</Label>
                  <Select value={formData.bank_name} onValueChange={(value) => updateField('bank_name', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emirates NBD">Emirates NBD</SelectItem>
                      <SelectItem value="ADCB">Abu Dhabi Commercial Bank</SelectItem>
                      <SelectItem value="FAB">First Abu Dhabi Bank</SelectItem>
                      <SelectItem value="RAKBANK">RAKBANK</SelectItem>
                      <SelectItem value="CBD">Commercial Bank of Dubai</SelectItem>
                      <SelectItem value="ENBD">Emirates Islamic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bank_code">Bank Code</Label>
                  <Input
                    id="bank_code"
                    value={formData.bank_code}
                    onChange={(e) => updateField('bank_code', e.target.value)}
                    placeholder="033"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="company_account_number">Company Account Number</Label>
                  <Input
                    id="company_account_number"
                    value={formData.company_account_number}
                    onChange={(e) => updateField('company_account_number', e.target.value)}
                    placeholder="1234567890123456"
                  />
                </div>
                <div>
                  <Label htmlFor="company_iban">Company IBAN *</Label>
                  <Input
                    id="company_iban"
                    value={formData.company_iban}
                    onChange={(e) => updateField('company_iban', e.target.value)}
                    placeholder="AE07 0331 2345 6789 0123 456"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="routing_code">Routing Code</Label>
                <Input
                  id="routing_code"
                  value={formData.routing_code}
                  onChange={(e) => updateField('routing_code', e.target.value)}
                  placeholder="EBILAEAD"
                />
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">WPS Configuration</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="wps_registered"
                    checked={formData.wps_registered}
                    onChange={(e) => updateField('wps_registered', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="wps_registered">Company is registered with WPS</Label>
                </div>

                {formData.wps_registered && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div>
                      <Label htmlFor="wps_employer_id">WPS Employer ID</Label>
                      <Input
                        id="wps_employer_id"
                        value={formData.wps_employer_id}
                        onChange={(e) => updateField('wps_employer_id', e.target.value)}
                        placeholder="WPS123456789"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary_transfer_method">Salary Transfer Method</Label>
                      <Select value={formData.salary_transfer_method} onValueChange={(value) => updateField('salary_transfer_method', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPS">WPS (Wage Protection System)</SelectItem>
                          <SelectItem value="SWIFT">SWIFT Transfer</SelectItem>
                          <SelectItem value="Local Transfer">Local Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="h-5 w-5 text-amber-600" />
                    <h5 className="font-semibold text-amber-900">WPS Registration Required</h5>
                  </div>
                  <p className="text-sm text-amber-800">
                    All companies in the UAE must be registered with the Wage Protection System (WPS) 
                    to process salary payments. Contact your bank to complete WPS registration if not already done.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-4">Role Assignment</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Assign team members to manage this employer's payroll and HR functions. 
                These assignments can be modified later.
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Admin Users</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Full access to all payroll and HR functions
                  </p>
                  <div className="space-y-2">
                    <Input
                      placeholder="Search and add admin users..."
                      className="w-full"
                    />
                    <div className="flex flex-wrap gap-2">
                      {/* This would be populated with selected users */}
                      <Badge variant="secondary">
                        Sarah Johnson (HR Director)
                        <button className="ml-2 text-red-500">×</button>
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Payroll Officers</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Access to payroll processing and salary management
                  </p>
                  <div className="space-y-2">
                    <Input
                      placeholder="Search and add payroll officers..."
                      className="w-full"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        Ahmed Al-Mansouri (Payroll Specialist)
                        <button className="ml-2 text-red-500">×</button>
                      </Badge>
                      <Badge variant="secondary">
                        Fatima Hassan (Finance Officer)
                        <button className="ml-2 text-red-500">×</button>
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">HR Managers</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Access to employee management and HR compliance
                  </p>
                  <div className="space-y-2">
                    <Input
                      placeholder="Search and add HR managers..."
                      className="w-full"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        Mohammed Khalil (HR Manager)
                        <button className="ml-2 text-red-500">×</button>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Permission Levels</h5>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Admin:</strong> All functions including settings and user management</div>
                  <div><strong>Payroll Officer:</strong> Process payruns, manage salaries, generate reports</div>
                  <div><strong>HR Manager:</strong> Employee management, leave tracking, compliance</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add New Employer</h1>
        <p className="text-muted-foreground">Complete the employer setup and WPS configuration</p>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-8">
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 
                  ${isCompleted ? 'bg-primary text-primary-foreground border-primary' : 
                    isActive ? 'bg-primary text-primary-foreground border-primary' : 
                    'border-gray-300 text-gray-400'}
                `}>
                  {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                </div>
                <div className={`mt-2 text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep}: {STEPS.find(s => s.id === currentStep)?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === STEPS.length ? (
              <>
                <Save className="h-4 w-4 mr-1" />
                Add Employer
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
