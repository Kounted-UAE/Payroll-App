// components/payroll-wizards/AddEmployeeWizard.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, Check, User, Briefcase, CreditCard, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);


interface Entity {
  id: string;
  name: string;
  profile_main_license_number?: string;
  lookup_emirate_name?: string;
  lookup_jurisdiction_name?: string;
  profile_vat_trn?: string;
}

const STEPS = [
  { id: 1, title: 'Personal Details', icon: User },
  { id: 2, title: 'Employment Details', icon: Briefcase },
  { id: 3, title: 'Banking Details', icon: CreditCard },
  { id: 4, title: 'Salary Setup', icon: DollarSign }
];

export default function AddEmployeeWizard({ onComplete, onCancel }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [entityList, setEntityList] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEntities = async () => {
      const { data, error } = await supabase.from('core_objects_entities').select('id, name, profile_main_license_number, lookup_emirate_name, lookup_jurisdiction_name, profile_vat_trn').order('name');
      if (!error) setEntityList(data as Entity[]);
    }
    fetchEntities();
  }, []);

  const updateField = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEntitySelect = (entityId: string) => {
    const entity = entityList.find(e => e.id === entityId);
    if (entity) {
      setSelectedEntity(entity);
      updateField('employer_name', entity.name);
      updateField('jurisdiction', entity.lookup_jurisdiction_name);
      updateField('emirate', entity.lookup_emirate_name);
      updateField('license_number', entity.profile_main_license_number);
      updateField('vat_trn', entity.profile_vat_trn);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return !!formData.full_name && !!formData.emirates_id;
      case 2:
        return !!formData.job_title && !!formData.start_date;
      case 3:
        return !!formData.bank_name && !!formData.iban;
      case 4:
        return !!formData.base_salary;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast({ title: 'Missing Fields', description: 'Please complete required fields.', variant: 'destructive' });
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setLoading(true);
      const { error } = await supabase
        .from('core_objects_employees') // or your employee table
        .insert([formData]);
      setLoading(false);

      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Employee added successfully!' });
      onComplete?.(formData);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-4">
        <h1 className="text-xs font-bold">Add New Employee</h1>
        <p className="text-muted-foreground">Start onboarding a new employee profile</p>
        <Progress value={progress} className="h-2 mt-3" />
      </div>

      {/* Stepper */}
      <div className="flex justify-center space-x-6 mb-6">
        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-primary bg-primary text-white' : isCompleted ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'}`}>
                {isCompleted ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
              </div>
              <div className="text-xs mt-1">{step.title}</div>
            </div>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep}: {STEPS[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <>
              <div>
                <Label htmlFor="entity_id">Link to Existing Entity (optional)</Label>
                <Select onValueChange={handleEntitySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityList.map(entity => (
                      <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input value={formData.full_name || ''} onChange={(e) => updateField('full_name', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="emirates_id">Emirates ID</Label>
                  <Input value={formData.emirates_id || ''} onChange={(e) => updateField('emirates_id', e.target.value)} />
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job_title">Job Title</Label>
                <Input value={formData.job_title || ''} onChange={(e) => updateField('job_title', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input type="date" value={formData.start_date || ''} onChange={(e) => updateField('start_date', e.target.value)} />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input value={formData.bank_name || ''} onChange={(e) => updateField('bank_name', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="iban">IBAN</Label>
                <Input value={formData.iban || ''} onChange={(e) => updateField('iban', e.target.value)} />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="base_salary">Base Salary (AED)</Label>
                <Input type="number" value={formData.base_salary || ''} onChange={(e) => updateField('base_salary', e.target.value)} />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input value={formData.currency || 'AED'} disabled />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))} disabled={currentStep === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button onClick={handleNext} disabled={loading}>
            {loading ? "Saving..." : (
              currentStep === STEPS.length ? (
                <>
                  <Save className="h-4 w-4 mr-1" /> Add Employee
                </>
              ) : (
                <>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
