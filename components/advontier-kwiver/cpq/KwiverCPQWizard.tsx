import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Save, Check } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Import step components
import ClientProfileStep from './KwiverCPQSteps/ClientProfileStep';
import AccountingScopeStep from './KwiverCPQSteps/AccountingScopeStep';
import PayrollScopeStep from './KwiverCPQSteps/PayrollScopeStep';
import HRComplianceStep from './KwiverCPQSteps/HRComplianceStep';
import TaxServicesStep from './KwiverCPQSteps/TaxServicesStep';
import ServiceSelectionStep from './KwiverCPQSteps/ServiceSelectionStep';
import ReviewConfirmStep from './KwiverCPQSteps/ReviewConfirmStep';
import LeadCaptureStep from './KwiverCPQSteps/LeadCaptureStep';

const STEPS = [
  { id: 1, title: 'Client Profile', component: ClientProfileStep },
  { id: 2, title: 'Accounting Scope', component: AccountingScopeStep },
  { id: 3, title: 'Payroll Scope', component: PayrollScopeStep },
  { id: 4, title: 'HR & Compliance', component: HRComplianceStep },
  { id: 5, title: 'Tax Services', component: TaxServicesStep },
  { id: 6, title: 'Service Selection', component: ServiceSelectionStep },
  { id: 7, title: 'Review & Confirm', component: ReviewConfirmStep },
  { id: 8, title: 'Complete Order', component: LeadCaptureStep }
];

interface KwiverKioskWizardProps {
  sessionId?: string;
  existingOrderId?: string;
  onComplete?: (orderId: string) => void;
}

export default function KwiverKioskWizard({ 
  sessionId: providedSessionId, 
  existingOrderId,
  onComplete 
}: KwiverKioskWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [autosaving, setAutosaving] = useState(false);
  const [pricing, setPricing] = useState({
    monthlyPrice: 0,
    annualPrice: 0,
    selectedTier: ''
  });
  const [sessionId, setSessionId] = useState(providedSessionId || uuidv4());
  const [referenceId, setReferenceId] = useState('');

  // Load existing data or draft
  useEffect(() => {
    if (existingOrderId) {
      loadOrderData(existingOrderId);
    } else {
      loadDraftData();
    }

    // Generate a reference ID if it doesn't exist
    if (!referenceId) {
      generateReferenceId();
    }
  }, [existingOrderId]);

  // Auto-save timer
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (Object.keys(formData).length > 0) {
        saveAsDraft();
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearTimeout(saveTimer);
  }, [formData]);

  const generateReferenceId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setReferenceId(`ORD-${year}${month}-${random}`);
  };

  const loadOrderData = async (orderId: string) => {
    try {
      setLoading(true);
      // TODO: order_intakes table doesn't exist in current schema
      // This needs to be updated when the backend is properly converted
      console.log('Order data loading disabled - table not available');
      
      // Set default values for now
      setFormData({});
      setReferenceId('');
      setPricing({
        monthlyPrice: 0,
        annualPrice: 0,
        selectedTier: ''
      });
      setCompletedSteps(new Set());
    } catch (error) {
      console.error('Error loading order data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load existing order data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDraftData = async () => {
    try {
      setLoading(true);
      // TODO: order_drafts table doesn't exist in current schema
      // This needs to be updated when the backend is properly converted
      console.log('Draft data loading disabled - table not available');
      
      // Set default values for now
      setFormData({});
      setCompletedSteps(new Set());
    } catch (error) {
      console.error('Error loading draft data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAsDraft = async () => {
    try {
      setAutosaving(true);
      // TODO: order_drafts table doesn't exist in current schema
      // This needs to be updated when the backend is properly converted
      console.log('Draft saving disabled - table not available');
    } catch (error) {
      console.error('Error auto-saving draft:', error);
    } finally {
      setAutosaving(false);
    }
  };

  const saveOrder = async (status = 'draft') => {
    setLoading(true);
    try {
      // TODO: order_intakes and order_drafts tables don't exist in current schema
      // This needs to be updated when the backend is properly converted
      console.log('Order saving disabled - tables not available');
      
      if (status === 'completed') {
        toast({
          title: 'Order Submitted',
          description: `Your order has been submitted successfully with reference ${referenceId}`
        });
        
        if (onComplete) {
          onComplete('mock-order-id');
        }
      } else {
        toast({
          title: 'Saved',
          description: 'Order saved successfully'
        });
      }

      return 'mock-order-id';
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: 'Error',
        description: 'Failed to save order',
        variant: 'destructive'
      });
      return null;
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

  const updatePricing = (pricingData: any) => {
    setPricing(prev => ({
      ...prev,
      ...pricingData
    }));
  };

  const handleMarkComplete = async () => {
    await saveOrder();
    setCompletedSteps(prev => new Set([...prev, currentStep]));

    // If we're on the last step, complete the order
    if (currentStep === STEPS.length) {
      await saveOrder('completed');
    } else {
      // Otherwise, proceed to the next step
      setCurrentStep(Math.min(STEPS.length, currentStep + 1));
    }
  };

  // Smart field skipping logic
  const shouldSkipStep = (step: number) => {
    // Skip payroll if no employees
    if (step === 3 && formData.step1?.employeeCount === 0) {
      return true;
    }
    // Skip HR if no employees
    if (step === 4 && formData.step1?.employeeCount === 0) {
      return true;
    }
    // Don't skip other steps
    return false;
  };

  const progress = (currentStep / STEPS.length) * 100;
  const CurrentStepComponent = STEPS.find(step => step.id === currentStep)?.component;

  const getStepStatus = (stepId: number) => {
    if (completedSteps.has(stepId)) return 'complete';
    if (stepId === currentStep) return 'current';
    if (stepId < currentStep) return 'visited';
    return 'pending';
  };

  const goToNextStep = () => {
    let nextStep = currentStep + 1;
    
    // Check if we need to skip the next step
    while (nextStep <= STEPS.length && shouldSkipStep(nextStep)) {
      nextStep++;
    }
    
    setCurrentStep(Math.min(STEPS.length, nextStep));
  };

  const goToPreviousStep = () => {
    let prevStep = currentStep - 1;
    
    // Check if we need to skip the previous step
    while (prevStep >= 1 && shouldSkipStep(prevStep)) {
      prevStep--;
    }
    
    setCurrentStep(Math.max(1, prevStep));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xs font-semibold text-foreground">Service Order Kiosk</h1>
              <p className="text-xs text-muted-foreground">
                {referenceId && <>Reference: {referenceId} · </>}
                {autosaving && <span className="text-muted-foreground">Autosaving...</span>}
              </p>
            </div>
            <Badge variant={pricing.monthlyPrice > 0 ? 'default' : 'secondary'}>
              {pricing.monthlyPrice > 0 
                ? `Estimated: AED ${pricing.monthlyPrice.toLocaleString()} / month` 
                : 'Configure services to see pricing'}
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
                    if (shouldSkipStep(step.id)) return null;
                    
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
                            ? 'border-l-muted-foreground bg-muted/30 text-foreground'
                            : 'border-l-transparent hover:bg-muted/50'
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
                    allData={formData}
                    onChange={updateFormData}
                    onPricingChange={updatePricing}
                    pricing={pricing}
                    referenceId={referenceId}
                  />
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={goToPreviousStep}
                      disabled={currentStep === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => saveOrder()}
                      disabled={loading}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save Draft
                    </Button>
                    
                    <Button
                      variant={currentStep === STEPS.length ? "default" : "secondary"}
                      onClick={handleMarkComplete}
                      disabled={loading}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      {currentStep === STEPS.length ? 'Complete Order' : 'Mark Complete'}
                    </Button>

                    {currentStep < STEPS.length && (
                      <Button
                        onClick={goToNextStep}
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
