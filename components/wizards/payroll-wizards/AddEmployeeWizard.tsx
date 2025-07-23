
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, Check, User, Briefcase, CreditCard, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddEmployeeWizardProps {
  onComplete: (employeeData: any) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Work Information', icon: Briefcase },
  { id: 3, title: 'Banking Details', icon: CreditCard },
  { id: 4, title: 'Salary Setup', icon: DollarSign }
];

export default function AddEmployeeWizard({ onComplete, onCancel }: AddEmployeeWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    full_name: '',
    emirates_id: '',
    passport_number: '',
    date_of_birth: '',
    nationality: '',
    gender: '',
    marital_status: '',
    contact_number: '',
    email: '',
    address: '',
    
    // Work Information
    employer_id: '',
    job_title: '',
    department: '',
    start_date: '',
    contract_type: '',
    contract_duration: '',
    visa_type: '',
    visa_expiry: '',
    work_permit_number: '',
    probation_period: '',
    
    // Banking Details
    bank_name: '',
    iban: '',
    account_number: '',
    swift_code: '',
    wps_flag: true,
    
    // Salary Setup
    base_salary: '',
    currency: 'AED',
    housing_allowance: '',
    transport_allowance: '',
    mobile_allowance: '',
    food_allowance: '',
    other_allowances: '',
    eosb_applicable: true,
    effective_from: ''
  });

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.full_name && formData.emirates_id && formData.passport_number && formData.nationality);
      case 2:
        return !!(formData.employer_id && formData.job_title && formData.start_date && formData.contract_type);
      case 3:
        return !!(formData.bank_name && formData.iban);
      case 4:
        return !!(formData.base_salary && formData.effective_from);
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
      description: "Employee added successfully"
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
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  placeholder="Ahmed Al-Mansouri"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emirates_id">Emirates ID *</Label>
                <Input
                  id="emirates_id"
                  value={formData.emirates_id}
                  onChange={(e) => updateField('emirates_id', e.target.value)}
                  placeholder="784-1990-1234567-8"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passport_number">Passport Number *</Label>
                <Input
                  id="passport_number"
                  value={formData.passport_number}
                  onChange={(e) => updateField('passport_number', e.target.value)}
                  placeholder="A1234567"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => updateField('date_of_birth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Select value={formData.nationality} onValueChange={(value) => updateField('nationality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="Pakistani">Pakistani</SelectItem>
                    <SelectItem value="British">British</SelectItem>
                    <SelectItem value="American">American</SelectItem>
                    <SelectItem value="Egyptian">Egyptian</SelectItem>
                    <SelectItem value="Lebanese">Lebanese</SelectItem>
                    <SelectItem value="Jordanian">Jordanian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => updateField('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input
                  id="contact_number"
                  value={formData.contact_number}
                  onChange={(e) => updateField('contact_number', e.target.value)}
                  placeholder="+971 50 123 4567"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="ahmed@company.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="Complete residential address"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employer_id">Employer *</Label>
                <Select value={formData.employer_id} onValueChange={(value) => updateField('employer_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Emirates Technology LLC</SelectItem>
                    <SelectItem value="2">Al Noor Industries PJSC</SelectItem>
                    <SelectItem value="3">Gulf Trading Company LLC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="job_title">Job Title *</Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={(e) => updateField('job_title', e.target.value)}
                  placeholder="Senior Software Engineer"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  placeholder="IT Department"
                />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => updateField('start_date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contract_type">Contract Type *</Label>
                <Select value={formData.contract_type} onValueChange={(value) => updateField('contract_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unlimited">Unlimited</SelectItem>
                    <SelectItem value="Limited">Limited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="contract_duration">Contract Duration (if Limited)</Label>
                <Select value={formData.contract_duration} onValueChange={(value) => updateField('contract_duration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 year">1 Year</SelectItem>
                    <SelectItem value="2 years">2 Years</SelectItem>
                    <SelectItem value="3 years">3 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="visa_type">Visa Type</Label>
                <Select value={formData.visa_type} onValueChange={(value) => updateField('visa_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visa type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employment Visa">Employment Visa</SelectItem>
                    <SelectItem value="Golden Visa">Golden Visa</SelectItem>
                    <SelectItem value="Investor Visa">Investor Visa</SelectItem>
                    <SelectItem value="Family Visa">Family Visa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="visa_expiry">Visa Expiry Date</Label>
                <Input
                  id="visa_expiry"
                  type="date"
                  value={formData.visa_expiry}
                  onChange={(e) => updateField('visa_expiry', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="work_permit_number">Work Permit Number</Label>
                <Input
                  id="work_permit_number"
                  value={formData.work_permit_number}
                  onChange={(e) => updateField('work_permit_number', e.target.value)}
                  placeholder="WP123456789"
                />
              </div>
              <div>
                <Label htmlFor="probation_period">Probation Period (months)</Label>
                <Select value={formData.probation_period} onValueChange={(value) => updateField('probation_period', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select probation period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
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
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  value={formData.account_number}
                  onChange={(e) => updateField('account_number', e.target.value)}
                  placeholder="1234567890123456"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="iban">IBAN *</Label>
                <Input
                  id="iban"
                  value={formData.iban}
                  onChange={(e) => updateField('iban', e.target.value)}
                  placeholder="AE07 0331 2345 6789 0123 456"
                  required
                />
              </div>
              <div>
                <Label htmlFor="swift_code">SWIFT/BIC Code</Label>
                <Input
                  id="swift_code"
                  value={formData.swift_code}
                  onChange={(e) => updateField('swift_code', e.target.value)}
                  placeholder="EBILAEAD"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="wps_flag"
                  checked={formData.wps_flag}
                  onChange={(e) => updateField('wps_flag', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="wps_flag">WPS (Wage Protection System) Enabled</Label>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Required for salary transfers through UAE banking system
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="base_salary">Base Salary *</Label>
                <Input
                  id="base_salary"
                  type="number"
                  value={formData.base_salary}
                  onChange={(e) => updateField('base_salary', e.target.value)}
                  placeholder="15000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => updateField('currency', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AED">AED</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="housing_allowance">Housing Allowance</Label>
                <Input
                  id="housing_allowance"
                  type="number"
                  value={formData.housing_allowance}
                  onChange={(e) => updateField('housing_allowance', e.target.value)}
                  placeholder="5000"
                />
              </div>
              <div>
                <Label htmlFor="transport_allowance">Transport Allowance</Label>
                <Input
                  id="transport_allowance"
                  type="number"
                  value={formData.transport_allowance}
                  onChange={(e) => updateField('transport_allowance', e.target.value)}
                  placeholder="1000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobile_allowance">Mobile Allowance</Label>
                <Input
                  id="mobile_allowance"
                  type="number"
                  value={formData.mobile_allowance}
                  onChange={(e) => updateField('mobile_allowance', e.target.value)}
                  placeholder="500"
                />
              </div>
              <div>
                <Label htmlFor="food_allowance">Food Allowance</Label>
                <Input
                  id="food_allowance"
                  type="number"
                  value={formData.food_allowance}
                  onChange={(e) => updateField('food_allowance', e.target.value)}
                  placeholder="800"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="other_allowances">Other Allowances (JSON format)</Label>
              <Textarea
                id="other_allowances"
                value={formData.other_allowances}
                onChange={(e) => updateField('other_allowances', e.target.value)}
                placeholder='{"education": 2000, "medical": 1500}'
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="eosb_applicable"
                    checked={formData.eosb_applicable}
                    onChange={(e) => updateField('eosb_applicable', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="eosb_applicable">EOSB Applicable</Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  End of Service Benefits as per UAE Labor Law
                </p>
              </div>
              <div>
                <Label htmlFor="effective_from">Effective From *</Label>
                <Input
                  id="effective_from"
                  type="date"
                  value={formData.effective_from}
                  onChange={(e) => updateField('effective_from', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Salary Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-3">Salary Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Base Salary:</span>
                  <span>{formData.currency} {formData.base_salary || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Housing:</span>
                  <span>{formData.currency} {formData.housing_allowance || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport:</span>
                  <span>{formData.currency} {formData.transport_allowance || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mobile:</span>
                  <span>{formData.currency} {formData.mobile_allowance || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Food:</span>
                  <span>{formData.currency} {formData.food_allowance || 0}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Gross:</span>
                  <span>{formData.currency} {
                    (parseFloat(formData.base_salary || '0') + 
                     parseFloat(formData.housing_allowance || '0') + 
                     parseFloat(formData.transport_allowance || '0') + 
                     parseFloat(formData.mobile_allowance || '0') + 
                     parseFloat(formData.food_allowance || '0')).toLocaleString()
                  }</span>
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
        <h1 className="text-2xl font-bold">Add New Employee</h1>
        <p className="text-muted-foreground">Complete the employee onboarding process</p>
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
                Add Employee
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
