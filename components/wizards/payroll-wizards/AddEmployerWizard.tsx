'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, Check, Search, Building, CreditCard, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@/hooks/useSession';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface AddEmployerWizardProps {
  onComplete?: (employerData: any) => void;
  onCancel?: () => void;
}

interface Entity {
  id: string;
  name: string;
  lookup_jurisdiction_name?: string;
  lookup_emirate_name?: string;
}

const STEPS = [
  { id: 1, title: 'Select from Entity (Optional)', icon: Search },
  { id: 2, title: 'Company Details', icon: Building },
  { id: 3, title: 'Bank & WPS Setup', icon: CreditCard },
  { id: 4, title: 'Review & Submit', icon: Eye }
];

export default function AddEmployerWizard({ onComplete, onCancel }: AddEmployerWizardProps) {
  const { session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [entities, setEntities] = useState<Entity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const [jurisdictions, setJurisdictions] = useState<any[]>([]);
  const [emirates, setEmirates] = useState<any[]>([]);
  const [touchedFields, setTouchedFields] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    entity_id: '',
    legal_name: '',
    mohre_establishment_id: '',
    jurisdiction: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    emirate: '',
    bank_name: '',
    routing_code: '',
    company_account_number: '',
    company_iban: '',
    wps_registered: false,
    wps_employer_id: '',
    salary_transfer_method: 'WPS'
  });

  useEffect(() => {
    const fetchJurisdictionsAndEmirates = async () => {
      const { data, error } = await supabase
        .from('kounted_uae_jurisdictions')
        .select('name')
        .order('name');

      if (!error && data) {
        setJurisdictions(data);
        const uniqueEmirates = [...new Set(data.map(item => {
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

  const searchEntities = async (term: string) => {
    if (!term.trim()) return setEntities([]);
    setSearchLoading(true);
    const { data, error } = await supabase
      .from('core_objects_entities')
      .select('id, name, lookup_jurisdiction_name, lookup_emirate_name')
      .ilike('name', `%${term}%`)
      .limit(10);
    setSearchLoading(false);
    if (!error && data) setEntities(data);
  };

  const handleEntitySelect = (entity: Entity) => {
    setSelectedEntity(entity);
    setFormData(prev => ({
      ...prev,
      entity_id: entity.id,
      legal_name: entity.name,
      jurisdiction: entity.lookup_jurisdiction_name || '',
      emirate: entity.lookup_emirate_name || ''
    }));
  };

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFieldBlur = (fieldName: string) => {
    if (!touchedFields.includes(fieldName)) {
      setTouchedFields(prev => [...prev, fieldName]);
    }
  };

  const isFieldError = (fieldName: string) => {
    if (!touchedFields.includes(fieldName)) return false;
    if (fieldName === "legal_name") return !formData.legal_name?.trim();
    if (fieldName === "address_line_1") return !formData.address_line_1?.trim();
    if (fieldName === "city") return !formData.city?.trim();
    if (fieldName === "emirate") return !formData.emirate?.trim();
    if (fieldName === "jurisdiction") return !formData.jurisdiction?.trim();
    if (fieldName === "bank_name") return !formData.bank_name?.trim();
    if (fieldName === "company_iban") return !formData.company_iban?.trim();
    return false;
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];
    if (step === 2) {
      if (!formData.legal_name?.trim()) errors.push("legal_name");
      if (!formData.address_line_1?.trim()) errors.push("address_line_1");
      if (!formData.city?.trim()) errors.push("city");
      if (!formData.emirate?.trim()) errors.push("emirate");
      if (!formData.jurisdiction?.trim()) errors.push("jurisdiction");
    } else if (step === 3) {
      if (!formData.bank_name?.trim()) errors.push("bank_name");
      if (!formData.company_iban?.trim()) errors.push("company_iban");
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
    if (!formData.legal_name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Legal company name is required",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const employerData = {
        entity_id: formData.entity_id || null,
        legal_name: formData.legal_name.trim(),
        mohre_establishment_id: formData.mohre_establishment_id?.trim() || null,
        jurisdiction: formData.jurisdiction?.trim() || null,
        address_line_1: formData.address_line_1?.trim() || null,
        address_line_2: formData.address_line_2?.trim() || null,
        city: formData.city?.trim() || null,
        emirate: formData.emirate?.trim() || null,
        bank_name: formData.bank_name?.trim() || null,
        routing_code: formData.routing_code?.trim() || null,
        company_account_number: formData.company_account_number?.trim() || null,
        company_iban: formData.company_iban?.trim() || null,
        wps_registered: formData.wps_registered,
        wps_employer_id: formData.wps_employer_id?.trim() || null,
        salary_transfer_method: formData.salary_transfer_method,
        status: 'Active',
        created_by_user_id: session?.user?.id || null,
        created_at: new Date().toISOString()
      };

      const { data: employer, error: employerError } = await supabase
        .from('payroll_objects_employers')
        .insert([employerData])
        .select()
        .single();

      if (employerError) {
        console.error("❌ Employer creation error:", employerError);
        throw employerError;
      }

      toast({ title: "Success", description: "Employer created successfully" });
      if (onComplete) onComplete(employer);
    } catch (err: any) {
      console.error("💥 Error creating employer:", err);
      toast({ title: "Error", description: err.message || "Failed to create employer", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    return (
      <div className="text-muted-foreground">
        <p>Step {currentStep} content goes here.</p>
      </div>
    );
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add New Employer</h1>
        <p className="text-muted-foreground">Set up a new employer for payroll management</p>
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
                  Create Employer
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
