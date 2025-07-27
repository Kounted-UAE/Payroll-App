// AddEmployerWizard.tsx

'use client'

import React, { useState, useEffect } from 'react';
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
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface AddEmployerWizardProps {
  onComplete?: (employerData: any) => void;
  onCancel?: () => void;
}

const STEPS = [
  { id: 1, title: 'Company Details', icon: Building },
  { id: 2, title: 'Address & Contact', icon: MapPin },
  { id: 3, title: 'WPS Setup', icon: CreditCard },
  { id: 4, title: 'Role Assignment', icon: Users }
];

export default function AddEmployerWizard({ onComplete, onCancel }: AddEmployerWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [jurisdictions, setJurisdictions] = useState<any[]>([]);
  const [emirates, setEmirates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<string[]>([]);
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

  // Fetch jurisdictions and emirates data
  useEffect(() => {
    const fetchJurisdictionsAndEmirates = async () => {
      const { data, error } = await supabase
        .from('kounted_uae_jurisdictions')
        .select('name')
        .order('name');
      
      if (!error && data) {
        setJurisdictions(data);
        // Extract unique emirates from jurisdiction names (you may need to adjust this based on your data structure)
        const uniqueEmirates = [...new Set(data.map(item => {
          // Extract emirate from jurisdiction name - adjust this logic based on your data
          const name = item.name.toLowerCase();
          if (name.includes('dubai')) return 'Dubai';
          if (name.includes('abu dhabi')) return 'Abu Dhabi';
          if (name.includes('sharjah')) return 'Sharjah';
          if (name.includes('ajman')) return 'Ajman';
          if (name.includes('ras al khaimah') || name.includes('rak')) return 'Ras Al Khaimah';
          if (name.includes('fujairah')) return 'Fujairah';
          if (name.includes('umm al quwain') || name.includes('uaq')) return 'Umm Al Quwain';
          return null;
        }).filter(Boolean))];
        setEmirates(uniqueEmirates.map(name => ({ name })));
      }
    };
    
    fetchJurisdictionsAndEmirates();
  }, []);

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFieldBlur = (fieldName: string) => {
    if (!touchedFields.includes(fieldName)) {
      setTouchedFields(prev => [...prev, fieldName]);
    }
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];
    if (step === 1) {
      if (!formData.legal_name?.trim()) errors.push("legal_name");
      if (!formData.trade_license_number?.trim()) errors.push("trade_license_number");
      if (!formData.jurisdiction?.trim()) errors.push("jurisdiction");
    } else if (step === 2) {
      if (!formData.address_line_1?.trim()) errors.push("address_line_1");
      if (!formData.city?.trim()) errors.push("city");
      if (!formData.emirate?.trim()) errors.push("emirate");
      if (!formData.contact_person_name?.trim()) errors.push("contact_person_name");
      // Validate email format if provided
      if (formData.contact_person_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_person_email)) {
        errors.push("contact_person_email");
      }
    } else if (step === 3) {
      if (!formData.bank_name?.trim()) errors.push("bank_name");
      if (!formData.company_iban?.trim()) errors.push("company_iban");
    }
    return errors;
  };
  

const handleNext = () => {
  const errors = validateStep(currentStep);
  if (errors.length === 0) {
    setTouchedFields([]); // clear previous errors
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  } else {
    setTouchedFields(errors);
    toast({
      title: "Validation Error",
      description: "Please complete all required fields before proceeding.",
      variant: "destructive",
    });
  }
};


  const handleComplete = async () => {
    // Validate required fields before submission
    if (!formData.legal_name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Legal company name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Transform form data to match database schema - only include valid fields
    const entityData = {
      name: formData.legal_name.trim(), // Required field
      profile_short_name: formData.trade_name?.trim() || null,
      profile_main_license_number: formData.trade_license_number?.trim() || null,
      lookup_jurisdiction_name: formData.jurisdiction?.trim() || null,
      lookup_emirate_name: formData.emirate?.trim() || null,
      profile_license_type: formData.business_type?.trim() || null,
      expiry_main_license: formData.license_expiry || null,
      status: 'Active', // Set default status
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('Submitting entity data:', entityData);

    const { data, error } = await supabase
      .from('core_objects_entities')
      .insert([entityData])
      .select();

    setLoading(false);

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast({
        title: "Error",
        description: `Failed to create employer: ${error.message}`,
        variant: "destructive"
      });
      return;
    }

    console.log('Successfully created entity:', data);

    toast({
      title: "Success",
      description: "Employer added successfully"
    });
    if (onComplete) {
      onComplete(data?.[0] || entityData);
    }
  };

  // Add visual validation helper
  const isFieldError = (fieldName: string) => {
    return touchedFields.includes(fieldName);
  };

  // Add error styling helper
  const getFieldClassName = (fieldName: string) => {
    return isFieldError(fieldName) 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
      : "";
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
                  onBlur={() => handleFieldBlur('legal_name')}
                  placeholder="Emirates Technology LLC"
                  required
                  className={getFieldClassName('legal_name')}
                />
                {isFieldError('legal_name') && <p className="text-red-500 text-xs mt-1">Required field</p>}
              </div>
              <div>
                <Label htmlFor="trade_name">Trade Name</Label>
                <Input
                  id="trade_name"
                  value={formData.trade_name}
                  onChange={(e) => updateField('trade_name', e.target.value)}
                  placeholder="ETech Solutions"
                  className={getFieldClassName('trade_name')}
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
                  onBlur={() => handleFieldBlur('trade_license_number')}
                  placeholder="CN-1234567"
                  required
                  className={getFieldClassName('trade_license_number')}
                />
                {isFieldError('trade_license_number') && <p className="text-red-500 text-xs mt-1">Required field</p>}
              </div>
              <div>
                <Label htmlFor="jurisdiction">Jurisdiction *</Label>
                <Select 
                  value={formData.jurisdiction} 
                  onValueChange={(value) => updateField('jurisdiction', value)}
                  onOpenChange={(open) => !open && handleFieldBlur('jurisdiction')}
                >
                  <SelectTrigger className={getFieldClassName('jurisdiction')}>
                    <SelectValue placeholder="Select jurisdiction" />
                  </SelectTrigger>
                  <SelectContent>
                    {jurisdictions.map((jurisdiction) => (
                      <SelectItem key={jurisdiction.name} value={jurisdiction.name}>
                        {jurisdiction.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isFieldError('jurisdiction') && <p className="text-red-500 text-xs mt-1">Required field</p>}
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
                  className={getFieldClassName('license_expiry')}
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
                {isFieldError('business_type') && <p className="text-red-500 text-xs mt-1">Required field</p>}
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
                  className={getFieldClassName('establishment_card')}
                />
              </div>
              <div>
                <Label htmlFor="mohre_establishment_id">MoHRE Establishment ID</Label>
                <Input
                  id="mohre_establishment_id"
                  value={formData.mohre_establishment_id}
                  onChange={(e) => updateField('mohre_establishment_id', e.target.value)}
                  placeholder="MID-987654321"
                  className={getFieldClassName('mohre_establishment_id')}
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Document Upload</h4>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                Please review the following documents (PDF format recommended) during KYC/CDD:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
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
                    className={getFieldClassName('address_line_1')}
                  />
                  {isFieldError('address_line_1') && <p className="text-red-500 text-xs mt-1">Required field</p>}
                </div>
                <div>
                  <Label htmlFor="address_line_2">Address Line 2</Label>
                  <Input
                    id="address_line_2"
                    value={formData.address_line_2}
                    onChange={(e) => updateField('address_line_2', e.target.value)}
                    placeholder="Sheikh Zayed Road"
                    className={getFieldClassName('address_line_2')}
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
                    className={getFieldClassName('city')}
                  />
                  {isFieldError('city') && <p className="text-red-500 text-xs mt-1">Required field</p>}
                </div>
                <div>
                  <Label htmlFor="emirate">Emirate *</Label>
                  <Select value={formData.emirate} onValueChange={(value) => updateField('emirate', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select emirate" />
                    </SelectTrigger>
                    <SelectContent>
                      {emirates.map((emirate) => (
                        <SelectItem key={emirate.name} value={emirate.name}>
                          {emirate.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isFieldError('emirate') && <p className="text-red-500 text-xs mt-1">Required field</p>}
                </div>
                <div>
                  <Label htmlFor="po_box">P.O. Box</Label>
                  <Input
                    id="po_box"
                    value={formData.po_box}
                    onChange={(e) => updateField('po_box', e.target.value)}
                    placeholder="12345"
                    className={getFieldClassName('po_box')}
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
                    className={getFieldClassName('phone_number')}
                  />
                </div>
                <div>
                  <Label htmlFor="fax_number">Fax Number</Label>
                  <Input
                    id="fax_number"
                    value={formData.fax_number}
                    onChange={(e) => updateField('fax_number', e.target.value)}
                    placeholder="+971 4 123 4568"
                    className={getFieldClassName('fax_number')}
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
                    className={getFieldClassName('email_address')}
                  />
                  {isFieldError('email_address') && <p className="text-red-500 text-xs mt-1">Required field</p>}
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="www.company.com"
                    className={getFieldClassName('website')}
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
                    className={getFieldClassName('contact_person_name')}
                  />
                  {isFieldError('contact_person_name') && <p className="text-red-500 text-xs mt-1">Required field</p>}
                </div>
                <div>
                  <Label htmlFor="contact_person_title">Job Title</Label>
                  <Input
                    id="contact_person_title"
                    value={formData.contact_person_title}
                    onChange={(e) => updateField('contact_person_title', e.target.value)}
                    placeholder="HR Manager"
                    className={getFieldClassName('contact_person_title')}
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
                    className={getFieldClassName('contact_person_phone')}
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
                    className={getFieldClassName('contact_person_email')}
                  />
                  {isFieldError('contact_person_email') && <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>}
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
<Input
  id="bank_name"
  name="bank_name"
  type="text"
  value={formData.bank_name}
  onChange={(e) => updateField('bank_name', e.target.value)}
  placeholder="Enter bank name"
  className={getFieldClassName('bank_name')}
/>
                {isFieldError('bank_name') && <p className="text-red-500 text-xs mt-1">Required field</p>}
                </div>
                <div>
                  <Label htmlFor="bank_code">Bank Code</Label>
                  <Input
                    id="bank_code"
                    value={formData.bank_code}
                    onChange={(e) => updateField('bank_code', e.target.value)}
                    placeholder="033"
                    className={getFieldClassName('bank_code')}
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
                    className={getFieldClassName('company_account_number')}
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
                    className={getFieldClassName('company_iban')}
                  />
                  {isFieldError('company_iban') && <p className="text-red-500 text-xs mt-1">Required field</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="routing_code">Routing Code</Label>
                <Input
                  id="routing_code"
                  value={formData.routing_code}
                  onChange={(e) => updateField('routing_code', e.target.value)}
                  placeholder="EBILAEAD"
                  className={getFieldClassName('routing_code')}
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
                        className={getFieldClassName('wps_employer_id')}
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
                  <p className="text-xs text-amber-800">
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
              <p className="text-xs text-muted-foreground mb-6">
                Assign team members to manage this employer's payroll and HR functions. 
                These assignments can be modified later.
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Admin Users</Label>
                  <p className="text-xs text-muted-foreground mb-3">
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
                  <p className="text-xs text-muted-foreground mb-3">
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
                  <p className="text-xs text-muted-foreground mb-3">
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
                <div className="text-xs text-blue-800 space-y-1">
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
        <h1 className="text-xs font-bold">Add New Employer</h1>
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
                <div className={`mt-2 text-xs font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
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
        <Button variant="outline" onClick={() => {
          if (onCancel) {
            onCancel();
          } else {
            window.history.back();
          }
        }}>
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
          
          <Button onClick={handleNext} disabled={loading}>
            {loading ? "Saving..." : (
              currentStep === STEPS.length ? (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Add Employer
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
