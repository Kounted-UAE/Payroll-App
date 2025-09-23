import React, { useEffect } from 'react';
import FormSection from '@/components/forms/FormSection';
import { RadioField } from '@/components/forms/FormField';
import { Card, CardContent } from '@/components/react-ui/card';
import { Badge } from '@/components/react-ui/badge';
import { Check, ArrowRight } from 'lucide-react';

interface StepProps {
  data: any;
  allData?: any;
  onChange: (data: any) => void;
  onPricingChange: (pricing: any) => void;
  pricing: any;
  referenceId?: string;
}

// Pricing matrix based on business complexity and size
const PRICING_MATRIX = {
  standard: {
    low: { base: 1500, accounting: 1200, payroll: 500, hr: 800, tax: 700 },
    medium: { base: 2000, accounting: 1800, payroll: 800, hr: 1200, tax: 1000 },
    high: { base: 3000, accounting: 2500, payroll: 1200, hr: 1800, tax: 1500 }
  },
  premium: {
    low: { base: 2500, accounting: 2000, payroll: 800, hr: 1500, tax: 1200 },
    medium: { base: 3500, accounting: 3000, payroll: 1500, hr: 2200, tax: 1800 },
    high: { base: 5000, accounting: 4000, payroll: 2000, hr: 3000, tax: 2500 }
  },
  enterprise: {
    low: { base: 4000, accounting: 3000, payroll: 1500, hr: 2500, tax: 2000 },
    medium: { base: 6000, accounting: 4500, payroll: 2500, hr: 3500, tax: 3000 },
    high: { base: 8000, accounting: 6000, payroll: 3500, hr: 5000, tax: 4000 }
  }
};

export default function ServiceSelectionStep({ data, allData, onChange, onPricingChange, pricing }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  // Determine complexity based on previous steps
  const getComplexity = () => {
    // Default to medium complexity
    let complexity = 'medium';
    
    const transactionVolume = allData?.step2?.transactionVolume || '';
    const employeeCount = parseInt(allData?.step1?.employeeCount || '0');
    const vatRegistered = allData?.step2?.vatRegistered === 'yes';
    const multiCurrency = allData?.step2?.currencyCount === '4+';
    
    // High complexity factors
    if (
      transactionVolume === 'high' || 
      transactionVolume === 'very_high' ||
      employeeCount > 20 ||
      (vatRegistered && multiCurrency)
    ) {
      complexity = 'high';
    }
    // Low complexity factors
    else if (
      transactionVolume === 'low' &&
      employeeCount <= 5 &&
      !multiCurrency
    ) {
      complexity = 'low';
    }
    
    return complexity;
  };

  // Calculate pricing based on selected tier and company complexity
  const calculatePricing = (selectedTier: string) => {
    const complexity = getComplexity();
    const pricing = PRICING_MATRIX[selectedTier as keyof typeof PRICING_MATRIX] || PRICING_MATRIX.standard;
    const tierPricing = pricing[complexity as keyof typeof PRICING_MATRIX.standard] || pricing.medium;
    
    let monthlyPrice = tierPricing.base;
    
    // Add service-specific costs
    if (allData?.step2) {
      monthlyPrice += tierPricing.accounting;
    }
    
    if (allData?.step3 && parseInt(allData?.step1?.employeeCount || '0') > 0) {
      monthlyPrice += tierPricing.payroll;
    }
    
    if (allData?.step4 && (allData?.step4?.hrServices || []).length > 0) {
      monthlyPrice += tierPricing.hr;
    }
    
    if (allData?.step5 && (allData?.step5?.vatRegistration === 'registered' || allData?.step5?.ctRegistration === 'registered')) {
      monthlyPrice += tierPricing.tax;
    }
    
    return {
      monthlyPrice,
      annualPrice: monthlyPrice * 12,
      selectedTier
    };
  };

  // Update pricing when tier changes
  useEffect(() => {
    if (data.selectedTier) {
      const newPricing = calculatePricing(data.selectedTier);
      onPricingChange(newPricing);
    }
  }, [data.selectedTier]);

  return (
    <div className="space-y-6">
      <FormSection title="Service Packages">
        <p className="text-xs text-blue-200 mb-4">
          Based on your requirements, we recommend the following service packages:
        </p>
        
        <RadioField
          label=""
          name="selectedTier"
          value={data.selectedTier || ''}
          onChange={updateField}
          options={[]}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Standard Tier */}
          <Card className={`border-2 ${data.selectedTier === 'standard' ? 'border-blue-500' : 'border-border'}`}>
            <CardContent className="p-0">
              <div 
                className={`p-4 ${data.selectedTier === 'standard' ? 'bg-blue-500 text-blue-500-foreground' : 'bg-blue-100'}`}
                onClick={() => updateField('selectedTier', 'standard')}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-xs">Standard</h3>
                  {data.selectedTier === 'standard' && <Check className="h-4 w-4" />}
                </div>
                <p className="text-xs opacity-90">Basic Compliance Package</p>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-bold">AED {PRICING_MATRIX.standard[getComplexity() as keyof typeof PRICING_MATRIX.standard].base.toLocaleString()}</span>
                    <span className="text-xs text-blue-200">/month</span>
                  </div>
                  <span className="text-xs text-blue-200">+ service fees</span>
                </div>

                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Basic Bookkeeping & Accounting</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Quarterly Financial Statements</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>VAT & Tax Compliance</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Basic Payroll Processing</span>
                  </li>
                </ul>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant="outline">Monthly Reports</Badge>
                  <Badge variant="outline">Compliance</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className={`border-2 ${data.selectedTier === 'premium' ? 'border-blue-500' : 'border-border'}`}>
            <CardContent className="p-0">
              <div 
                className={`p-4 ${data.selectedTier === 'premium' ? 'bg-blue-500 text-blue-500-foreground' : 'bg-blue-100'}`}
                onClick={() => updateField('selectedTier', 'premium')}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-xs">Premium</h3>
                  {data.selectedTier === 'premium' && <Check className="h-4 w-4" />}
                </div>
                <p className="text-xs opacity-90">Compliance + Advisory</p>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-bold">AED {PRICING_MATRIX.premium[getComplexity() as keyof typeof PRICING_MATRIX.premium].base.toLocaleString()}</span>
                    <span className="text-xs text-blue-200">/month</span>
                  </div>
                  <span className="text-xs text-blue-200">+ service fees</span>
                </div>

                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Full Bookkeeping & Accounting</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Monthly Financial Statements</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Advanced Tax Services</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Complete Payroll & HR Services</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Financial Advisory</span>
                  </li>
                </ul>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant="outline">Advisory</Badge>
                  <Badge variant="outline">Detailed Reports</Badge>
                  <Badge variant="outline">HR Support</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise Tier */}
          <Card className={`border-2 ${data.selectedTier === 'enterprise' ? 'border-blue-500' : 'border-border'}`}>
            <CardContent className="p-0">
              <div 
                className={`p-4 ${data.selectedTier === 'enterprise' ? 'bg-blue-500 text-blue-500-foreground' : 'bg-blue-100'}`}
                onClick={() => updateField('selectedTier', 'enterprise')}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-xs">Enterprise</h3>
                  {data.selectedTier === 'enterprise' && <Check className="h-4 w-4" />}
                </div>
                <p className="text-xs opacity-90">Full Finance Department</p>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-bold">AED {PRICING_MATRIX.enterprise[getComplexity() as keyof typeof PRICING_MATRIX.enterprise].base.toLocaleString()}</span>
                    <span className="text-xs text-blue-200">/month</span>
                  </div>
                  <span className="text-xs text-blue-200">+ service fees</span>
                </div>

                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Comprehensive Finance Department</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Dedicated Account Manager</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>CFO-Level Strategic Advisory</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Complete Tax & Compliance</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Full HR & Payroll Management</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs">
                    <Check className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Custom Reporting & Analytics</span>
                  </li>
                </ul>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant="outline">Strategic CFO</Badge>
                  <Badge variant="outline">Custom Dashboards</Badge>
                  <Badge variant="outline">Full Support</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FormSection>

      {data.selectedTier && (
        <div className="bg-accent/30 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium">Estimated Monthly Cost</h3>
              <p className="text-xs text-blue-200">Based on your requirements</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold">AED {pricing.monthlyPrice.toLocaleString()}</div>
              <div className="text-xs text-blue-200">AED {pricing.annualPrice.toLocaleString()} annually</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}