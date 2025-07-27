'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Save, Check, User, Building, CreditCard, DollarSign, Eye, Plus, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@/hooks/useSession';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface AddEmployeeWizardProps {
  onComplete?: (employeeData: any) => void;
  onCancel?: () => void;
}

interface Employer {
  id: string;
  legal_name: string;
  jurisdiction?: string;
  emirate?: string;
}

interface PayType {
  id: string;
  name: string;
  group: string;
  description?: string;
}

interface SalarySetup {
  pay_type_id: string;
  amount: number;
  effective_from: string;
  currency: string;
}

const STEPS = [
  { id: 1, title: 'Employment Details', icon: Building },
  { id: 2, title: 'Employee Details', icon: User },
  { id: 3, title: 'Banking Details', icon: CreditCard },
  { id: 4, title: 'Salary Setup', icon: DollarSign },
  { id: 5, title: 'Review & Submit', icon: Eye }
];

const PAY_TYPE_GROUPS = [
  'Wages',
  'Allowances', 
  'Deductions',
  'Non-Taxable Allowances',
  'Tax',
  'Employer Contributions'
];

export default function AddEmployeeWizard({ onComplete, onCancel }: AddEmployeeWizardProps) {
  const { session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<string[]>([]);
  
  // Data fetching states
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [payTypes, setPayTypes] = useState<PayType[]>([]);
  const [loadingEmployers, setLoadingEmployers] = useState(false);
  const [loadingPayTypes, setLoadingPayTypes] = useState(false);
  
  // Quick add modal states
  const [showQuickAddEmployer, setShowQuickAddEmployer] = useState(false);
  const [showQuickAddPayType, setShowQuickAddPayType] = useState(false);
  const [quickAddLoading, setQuickAddLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Employment Details
    employer_id: '',
    
    // Step 2: Employee Details
    first_name: '',
    last_name: '',
    email: '',
    emirates_id: '',
    passport_number: '',
    nationality: '',
    
    // Step 3: Banking Details
    bank_name: '',
    routing_code: '',
    account_number: '',
    iban: '',
    
    // Step 4: Salary Setup
    salary_setup: [] as SalarySetup[]
  });

  // Quick add form data
  const [quickAddData, setQuickAddData] = useState({
    employer_name: '',
    pay_type_name: '',
    pay_type_group: ''
  });

  // Fetch employers on mount
  useEffect(() => {
    fetchEmployers();
  }, []);

  // Fetch pay types when reaching step 4
  useEffect(() => {
    if (currentStep === 4) {
      fetchPayTypes();
    }
  }, [currentStep]);

  const fetchEmployers = async () => {
    setLoadingEmployers(true);
    const { data, error } = await supabase
      .from('payroll_objects_employers')
      .select('id, legal_name, jurisdiction, emirate')
      .order('legal_name');
    
    setLoadingEmployers(false);
    if (!error && data) {
      setEmployers(data);
    }
  };

  const fetchPayTypes = async () => {
    setLoadingPayTypes(true);
    const { data, error } = await supabase
      .from('payroll_pay_types')
      .select('id, name, group, description')
      .order('group, name');
    
    setLoadingPayTypes(false);
    if (!error && data) {
      setPayTypes(data);
    }
  };

  const handleQuickAddEmployer = async () => {
    if (!quickAddData.employer_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Employer name is required",
        variant: "destructive"
      });
      return;
    }

    setQuickAddLoading(true);
    try {
      const { data: newEmployer, error } = await supabase
        .from('payroll_objects_employers')
        .insert([{
          legal_name: quickAddData.employer_name.trim(),
          status: 'Active',
          created_by_user_id: session?.user?.id || null
        }])
        .select()
        .single();

      if (error) throw error;

      setEmployers(prev => [...prev, newEmployer]);
      setFormData(prev => ({ ...prev, employer_id: newEmployer.id }));
      setQuickAddData(prev => ({ ...prev, employer_name: '' }));
      setShowQuickAddEmployer(false);

      toast({
        title: "Success",
        description: "Employer created successfully"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create employer",
        variant: "destructive"
      });
    } finally {
      setQuickAddLoading(false);
    }
  };

  const handleQuickAddPayType = async () => {
    if (!quickAddData.pay_type_name.trim() || !quickAddData.pay_type_group) {
      toast({
        title: "Validation Error",
        description: "Pay type name and group are required",
        variant: "destructive"
      });
      return;
    }

    setQuickAddLoading(true);
    try {
      const { data: newPayType, error } = await supabase
        .from('payroll_pay_types')
        .insert([{
          name: quickAddData.pay_type_name.trim(),
          group: quickAddData.pay_type_group,
          created_by_user_id: session?.user?.id || null
        }])
        .select()
        .single();

      if (error) throw error;

      setPayTypes(prev => [...prev, newPayType]);
      setQuickAddData(prev => ({ ...prev, pay_type_name: '', pay_type_group: '' }));
      setShowQuickAddPayType(false);

      toast({
        title: "Success",
        description: "Pay type created successfully"
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create pay type",
        variant: "destructive"
      });
    } finally {
      setQuickAddLoading(false);
    }
  };

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateSalarySetup = (index: number, field: keyof SalarySetup, value: any) => {
    setFormData(prev => ({
      ...prev,
      salary_setup: prev.salary_setup.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addSalaryItem = () => {
    setFormData(prev => ({
      ...prev,
      salary_setup: [...prev.salary_setup, {
        pay_type_id: '',
        amount: 0,
        effective_from: new Date().toISOString().split('T')[0],
        currency: 'AED'
      }]
    }));
  };

  const removeSalaryItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      salary_setup: prev.salary_setup.filter((_, i) => i !== index)
    }));
  };

  const handleFieldBlur = (fieldName: string) => {
    if (!touchedFields.includes(fieldName)) {
      setTouchedFields(prev => [...prev, fieldName]);
    }
  };

  const isFieldError = (fieldName: string) => {
    if (!touchedFields.includes(fieldName)) return false;

    if (fieldName === "employer_id") return !formData.employer_id;
    if (fieldName === "first_name") return !formData.first_name?.trim();
    if (fieldName === "last_name") return !formData.last_name?.trim();
    if (fieldName === "email") {
      return formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    }

    return false;
  };

  const getFieldClassName = (fieldName: string) => {
    return isFieldError(fieldName) 
      ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
      : "";
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];
    
    if (step === 1) {
      if (!formData.employer_id) errors.push("employer_id");
    } else if (step === 2) {
      if (!formData.first_name?.trim()) errors.push("first_name");
      if (!formData.last_name?.trim()) errors.push("last_name");
      if (!formData.email?.trim()) errors.push("email");
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push("email");
      }
    } else if (step === 3) {
      // Banking details are optional
    } else if (step === 4) {
      // Salary setup is optional but validate if items exist
      formData.salary_setup.forEach((item, index) => {
        if (item.pay_type_id && !item.amount) {
          errors.push(`salary_amount_${index}`);
        }
      });
    }
    
    return errors;
  };

  const handleNext = () => {
    const errors = validateStep(currentStep);
    if (errors.length === 0) {
      setTouchedFields([]);
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
    setLoading(true);
    try {
      // Create employee record
      const employeeData = {
        employer_id: formData.employer_id,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        emirates_id: formData.emirates_id?.trim() || null,
        passport_number: formData.passport_number?.trim() || null,
        nationality: formData.nationality?.trim() || null,
        bank_name: formData.bank_name?.trim() || null,
        routing_code: formData.routing_code?.trim() || null,
        account_number: formData.account_number?.trim() || null,
        iban: formData.iban?.trim() || null,
        status: 'Active',
        created_by_user_id: session?.user?.id || null,
        created_at: new Date().toISOString()
      };

      const { data: employee, error: employeeError } = await supabase
        .from('payroll_objects_employees')
        .insert([employeeData])
        .select()
        .single();

      if (employeeError) throw employeeError;

      // Create salary setup records if any
      if (formData.salary_setup.length > 0) {
        const salarySetupData = formData.salary_setup
          .filter(item => item.pay_type_id && item.amount > 0)
          .map(item => ({
            employee_id: employee.id,
            pay_type_id: item.pay_type_id,
            amount: item.amount,
            effective_from: item.effective_from,
            currency: item.currency,
            created_by_user_id: session?.user?.id || null
          }));

        if (salarySetupData.length > 0) {
          const { error: salaryError } = await supabase
            .from('payroll_salary_setup')
            .insert(salarySetupData);

          if (salaryError) throw salaryError;
        }
      }

      toast({
        title: "Success",
        description: "Employee created successfully"
      });

      if (onComplete) {
        onComplete(employee);
      }
    } catch (err: any) {
      console.error("💥 Error creating employee:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create employee",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
              <p className="text-muted-foreground mb-6">
                Select the employer for this employee.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="employer_id">Employer *</Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.employer_id} 
                    onValueChange={(value) => updateField('employer_id', value)}
                    onOpenChange={(open) => !open && handleFieldBlur('employer_id')}
                  >
                    <SelectTrigger className={`flex-1 ${getFieldClassName('employer_id')}`}>
                      <SelectValue placeholder="Select employer" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingEmployers ? (
                        <SelectItem value="" disabled>Loading employers...</SelectItem>
                      ) : (
                        employers.map((employer) => (
                          <SelectItem key={employer.id} value={employer.id}>
                            {employer.legal_name}
                            {employer.jurisdiction && ` (${employer.jurisdiction})`}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  
                  <Dialog open={showQuickAddEmployer} onOpenChange={setShowQuickAddEmployer}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="whitespace-nowrap">
                        <Plus className="h-4 w-4 mr-2" />
                        Quick Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Quick Add Employer</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="employer_name">Employer Name *</Label>
                          <Input
                            id="employer_name"
                            value={quickAddData.employer_name}
                            onChange={(e) => setQuickAddData(prev => ({ ...prev, employer_name: e.target.value }))}
                            placeholder="Enter employer name"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowQuickAddEmployer(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleQuickAddEmployer} disabled={quickAddLoading}>
                            {quickAddLoading ? "Creating..." : "Create Employer"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {isFieldError('employer_id') && <p className="text-red-500 text-sm mt-1">Required field</p>}
              </div>

              {formData.employer_id && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">Selected Employer</h4>
                  </div>
                  <p className="text-sm text-blue-800">
                    {employers.find(e => e.id === formData.employer_id)?.legal_name}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Employee Details</h3>
              <p className="text-muted-foreground mb-6">
                Provide the employee's personal information.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => updateField('first_name', e.target.value)}
                  onBlur={() => handleFieldBlur('first_name')}
                  placeholder="John"
                  required
                  className={getFieldClassName('first_name')}
                />
                {isFieldError('first_name') && <p className="text-red-500 text-sm mt-1">Required field</p>}
              </div>

              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => updateField('last_name', e.target.value)}
                  onBlur={() => handleFieldBlur('last_name')}
                  placeholder="Doe"
                  required
                  className={getFieldClassName('last_name')}
                />
                {isFieldError('last_name') && <p className="text-red-500 text-sm mt-1">Required field</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                placeholder="john.doe@company.com"
                required
                className={getFieldClassName('email')}
              />
              {isFieldError('email') && <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emirates_id">Emirates ID</Label>
                <Input
                  id="emirates_id"
                  value={formData.emirates_id}
                  onChange={(e) => updateField('emirates_id', e.target.value)}
                  placeholder="784-1234-5678901-2"
                />
              </div>

              <div>
                <Label htmlFor="passport_number">Passport Number</Label>
                <Input
                  id="passport_number"
                  value={formData.passport_number}
                  onChange={(e) => updateField('passport_number', e.target.value)}
                  placeholder="A12345678"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => updateField('nationality', e.target.value)}
                placeholder="UAE"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Banking Details</h3>
              <p className="text-muted-foreground mb-6">
                Provide the employee's banking information for salary payments.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank_name">Bank Name</Label>
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
                <Label htmlFor="routing_code">Routing Code</Label>
                <Input
                  id="routing_code"
                  value={formData.routing_code}
                  onChange={(e) => updateField('routing_code', e.target.value)}
                  placeholder="EBILAEAD"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="account_number">Account Number</Label>
                <Input
                  id="account_number"
                  value={formData.account_number}
                  onChange={(e) => updateField('account_number', e.target.value)}
                  placeholder="1234567890123456"
                />
              </div>

              <div>
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  value={formData.iban}
                  onChange={(e) => updateField('iban', e.target.value)}
                  placeholder="AE07 0331 2345 6789 0123 456"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Salary Setup</h3>
              <p className="text-muted-foreground mb-6">
                Configure the employee's salary structure and benefits.
              </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Salary Components</h4>
              
              <Dialog open={showQuickAddPayType} onOpenChange={setShowQuickAddPayType}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add Pay Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Quick Add Pay Type</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pay_type_group">Group *</Label>
                      <Select 
                        value={quickAddData.pay_type_group} 
                        onValueChange={(value) => setQuickAddData(prev => ({ ...prev, pay_type_group: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAY_TYPE_GROUPS.map(group => (
                            <SelectItem key={group} value={group}>{group}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pay_type_name">Pay Type Name *</Label>
                      <Input
                        id="pay_type_name"
                        value={quickAddData.pay_type_name}
                        onChange={(e) => setQuickAddData(prev => ({ ...prev, pay_type_name: e.target.value }))}
                        placeholder="e.g., Housing Allowance"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowQuickAddPayType(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleQuickAddPayType} disabled={quickAddLoading}>
                        {quickAddLoading ? "Creating..." : "Create Pay Type"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loadingPayTypes ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Loading pay types...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {PAY_TYPE_GROUPS.map(group => {
                  const groupPayTypes = payTypes.filter(pt => pt.group === group);
                  const groupSalaryItems = formData.salary_setup.filter((_, index) => {
                    const payType = payTypes.find(pt => pt.id === formData.salary_setup[index]?.pay_type_id);
                    return payType?.group === group;
                  });

                  if (groupPayTypes.length === 0) return null;

                  return (
                    <Card key={group}>
                      <CardHeader>
                        <CardTitle className="text-base">{group}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {groupPayTypes.map(payType => {
                          const salaryIndex = formData.salary_setup.findIndex(item => item.pay_type_id === payType.id);
                          const hasSalary = salaryIndex !== -1;

                          return (
                            <div key={payType.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium">{payType.name}</div>
                                {payType.description && (
                                  <div className="text-sm text-muted-foreground">{payType.description}</div>
                                )}
                              </div>
                              
                              {hasSalary ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    value={formData.salary_setup[salaryIndex].amount}
                                    onChange={(e) => updateSalarySetup(salaryIndex, 'amount', parseFloat(e.target.value) || 0)}
                                    className="w-24"
                                    placeholder="0"
                                  />
                                  <span className="text-sm text-muted-foreground">AED</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeSalaryItem(salaryIndex)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    addSalaryItem();
                                    const newIndex = formData.salary_setup.length;
                                    updateSalarySetup(newIndex, 'pay_type_id', payType.id);
                                  }}
                                >
                                  Add
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Submit</h3>
              <p className="text-muted-foreground mb-6">
                Review all information before creating the employee record.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Employment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employer:</span>
                    <span className="font-medium">
                      {employers.find(e => e.id === formData.employer_id)?.legal_name}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Employee Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{formData.first_name} {formData.last_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                  {formData.emirates_id && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Emirates ID:</span>
                      <span className="font-medium">{formData.emirates_id}</span>
                    </div>
                  )}
                  {formData.nationality && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nationality:</span>
                      <span className="font-medium">{formData.nationality}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Banking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.bank_name && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-medium">{formData.bank_name}</span>
                    </div>
                  )}
                  {formData.iban && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IBAN:</span>
                      <span className="font-medium text-xs">{formData.iban}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Salary Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.salary_setup.length > 0 ? (
                    formData.salary_setup
                      .filter(item => item.pay_type_id && item.amount > 0)
                      .map((item, index) => {
                        const payType = payTypes.find(pt => pt.id === item.pay_type_id);
                        return (
                          <div key={index} className="flex justify-between">
                            <span className="text-muted-foreground">{payType?.name}:</span>
                            <span className="font-medium">{item.amount} {item.currency}</span>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-muted-foreground">No salary components configured</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-2">What happens next?</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Employee record will be created in the system</li>
                <li>• Salary structure will be configured</li>
                <li>• Employee will be ready for payroll processing</li>
                <li>• You can add more employees or proceed to payroll setup</li>
              </ul>
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add New Employee</h1>
        <p className="text-muted-foreground">Set up a new employee for payroll management</p>
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>

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

      <Card>
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>

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
            {loading ? "Processing..." : (
              currentStep === STEPS.length ? (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  Create Employee
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
