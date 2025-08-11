import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Save, Check } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';

// Import step components
import CompanyProfileStep from '../accounting-onboarding-steps/CompanyProfileStep';
import BusinessOperationsStep from '../accounting-onboarding-steps/BusinessOperationsStep';
import ManagementGovernanceStep from '../accounting-onboarding-steps/ManagementGovernanceStep';
import FinancialControlsStep from '../accounting-onboarding-steps/FinancialControlsStep';
import FraudEthicsStep from '../accounting-onboarding-steps/FraudEthicsStep';
import GoingConcernStep from '../accounting-onboarding-steps/GoingConcernStep';
import RevenueDebtorsStep from '../accounting-onboarding-steps/RevenueDebtorsStep';
import PurchasesCreditorsStep from '../accounting-onboarding-steps/PurchasesCreditorsStep';
import PayrollHRStep from '../accounting-onboarding-steps/PayrollHRStep';
import InventoryAssetsStep from '../accounting-onboarding-steps/InventoryAssetsStep';
import BankingTreasuryStep from '../accounting-onboarding-steps/BankingTreasuryStep';
import ComplianceReportingStep from '../accounting-onboarding-steps/ComplianceReportingStep';
import RiskContinuityStep from '../accounting-onboarding-steps/RiskContinuityStep';
import TechnologyIntegrationsStep from '../accounting-onboarding-steps/TechnologyIntegrationsStep';

const STEPS = [
  { id: 1, title: 'Company Profile', component: CompanyProfileStep },
  { id: 2, title: 'Business Operations', component: BusinessOperationsStep },
  { id: 3, title: 'Management & Governance', component: ManagementGovernanceStep },
  { id: 4, title: 'Financial Controls', component: FinancialControlsStep },
  { id: 5, title: 'Fraud & Ethics', component: FraudEthicsStep },
  { id: 6, title: 'Going Concern', component: GoingConcernStep },
  { id: 7, title: 'Revenue & Debtors', component: RevenueDebtorsStep },
  { id: 8, title: 'Purchases & Creditors', component: PurchasesCreditorsStep },
  { id: 9, title: 'Payroll & HR', component: PayrollHRStep },
  { id: 10, title: 'Inventory & Assets', component: InventoryAssetsStep },
  { id: 11, title: 'Banking & Treasury', component: BankingTreasuryStep },
  { id: 12, title: 'Compliance & Reporting', component: ComplianceReportingStep },
  { id: 13, title: 'Risk & Continuity', component: RiskContinuityStep },
  { id: 14, title: 'Technology & Integrations', component: TechnologyIntegrationsStep }
];

interface ClientOnboardingWizardProps {
  clientId: string;
  clientName?: string;
}

export default function ClientOnboardingWizard({ clientId, clientName = 'Client' }: ClientOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Load existing profile data
  useEffect(() => {
    loadProfileData();
  }, [clientId]);

  const loadProfileData = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await (supabase as any)
        .from('client_operational_profiles')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData(data.profile_data || {});
        setLastUpdated(new Date(data.last_updated_at));
        // Determine completed steps based on data presence
        const completed = new Set<number>();
        STEPS.forEach(step => {
          const stepData = data.profile_data[`step${step.id}`];
          if (stepData && Object.keys(stepData).length > 0) {
            completed.add(step.id);
          }
        });
        setCompletedSteps(completed);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load existing data',
        variant: 'destructive'
      });
    }
  };

  const saveData = async (markComplete = false) => {
    setLoading(true);
    try {
      const updateData = {
        client_id: clientId,
        profile_data: formData,
        status: markComplete && completedSteps.size === STEPS.length ? 'complete' : 'draft',
        last_updated_at: new Date().toISOString()
      };

      const supabase = getSupabaseClient();
      const { error } = await (supabase as any)
        .from('client_operational_profiles')
        .upsert(updateData, {
          onConflict: 'client_id',
          ignoreDuplicates: false
        });

      if (error) throw error;

      if (markComplete) {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
      }

      setLastUpdated(new Date());
      toast({
        title: 'Success',
        description: markComplete ? 'Step completed' : 'Data saved as draft'
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (stepData: any) => {
    setFormData(prev => ({
      ...prev,
      [`step${currentStep}`]: {
        ...(prev as any)[`step${currentStep}`],
        ...stepData
      }
    }));
  };

  const progress = (currentStep / STEPS.length) * 100;
  const CurrentStepComponent = STEPS.find(step => step.id === currentStep)?.component;

  const getStepStatus = (stepId: number) => {
    if (completedSteps.has(stepId)) return 'complete';
    if (stepId === currentStep) return 'current';
    if (stepId < currentStep) return 'visited';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xs font-semibold text-foreground">{clientName} - Client Onboarding</h1>
              {lastUpdated && (
                <p className="text-xs text-blue-200">
                  Last updated: {lastUpdated.toLocaleString()}
                </p>
              )}
            </div>
            <Badge variant={completedSteps.size === STEPS.length ? 'default' : 'secondary'}>
              {completedSteps.size}/{STEPS.length} Steps Complete
            </Badge>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs">Steps</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {STEPS.map((step) => {
                    const status = getStepStatus(step.id);
                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`w-full text-left p-3 rounded-none border-l-2 transition-colors ${
                          status === 'complete'
                            ? 'border-l-blue-500 bg-blue-500/5 text-blue-500'
                            : status === 'current'
                            ? 'border-l-blue-500 bg-blue-500/10 text-blue-500 font-medium'
                            : status === 'visited'
                            ? 'border-l-muted-foreground bg-blue-100/30 text-foreground'
                            : 'border-l-transparent hover:bg-blue-100/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {status === 'complete' && <Check className="h-4 w-4" />}
                          <span className="text-xs">{step.id}. {step.title}</span>
                        </div>
                      </button>
                    );
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
                  <CardTitle>Step {currentStep}: {STEPS.find(s => s.id === currentStep)?.title}</CardTitle>
                  {completedSteps.has(currentStep) && (
                    <Badge variant="default" className="gap-1">
                      <Check className="h-3 w-3" />
                      Complete
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {CurrentStepComponent && (
                  <CurrentStepComponent 
                    data={formData[`step${currentStep}` as keyof typeof formData] || {}}
                    onChange={updateFormData}
                  />
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                      disabled={currentStep === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => saveData(false)}
                      disabled={loading}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save Draft
                    </Button>
                    
                    <Button
                      variant="secondary"
                      onClick={() => saveData(true)}
                      disabled={loading}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>

                    {currentStep < STEPS.length && (
                      <Button
                        onClick={() => setCurrentStep(Math.min(STEPS.length, currentStep + 1))}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}