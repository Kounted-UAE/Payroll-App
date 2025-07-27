import React from 'react';
import FormSection from '@/components/wizards/FormSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface StepProps {
  data: any;
  allData?: any;
  onChange: (data: any) => void;
  onPricingChange?: (pricing: any) => void;
  pricing?: any;
  referenceId?: string;
}

export default function ReviewConfirmStep({ data, allData, onChange, pricing, referenceId }: StepProps) {
  const getServiceSummary = () => {
    const summary = [];
    
    // Accounting summary
    if (allData?.step2) {
      const transactions = allData.step2.transactionVolume || 'medium';
      const transactionText = {
        low: 'Up to 100 transactions/month',
        medium: '100-300 transactions/month',
        high: '301-1000 transactions/month',
        very_high: '1000+ transactions/month'
      }[transactions] || 'Medium volume';
      
      const vatStatus = allData.step2.vatRegistered === 'yes' ? ' with VAT' : '';
      const integrations = allData.step1?.integrationNeeds || [];
      const integrationText = integrations.length > 0 
        ? ` & ${integrations.map((i: string) => i.charAt(0).toUpperCase() + i.slice(1)).join(', ')} Integration` 
        : '';
      
      summary.push(`Accounting: ${transactionText}${vatStatus}${integrationText}`);
    }
    
    // Payroll summary
    if (allData?.step3 && parseInt(allData?.step1?.employeeCount || '0') > 0) {
      const employeeCount = allData.step1.employeeCount || '0';
      const wps = allData.step3.wpsIntegration === 'yes' ? ' with WPS' : '';
      const eosg = allData.step3.eosgCalculation === 'yes' ? ' & EOSB tracking' : '';
      
      summary.push(`Payroll: ${employeeCount} employees${wps}${eosg}`);
    }
    
    // Tax summary
    if (allData?.step5) {
      const vatFiling = allData.step5.vatReturnFiling 
        ? `${allData.step5.vatReturnFiling.charAt(0).toUpperCase() + allData.step5.vatReturnFiling.slice(1)} VAT Filing` 
        : '';
      
      const ct = allData.step5.ctRegistration === 'registered' || allData.step5.ctRegistration === 'need_registration' 
        ? 'CT Registration' 
        : '';
      
      if (vatFiling || ct) {
        summary.push(`Tax: ${[ct, vatFiling].filter(Boolean).join(' + ')}`);
      }
    }
    
    // HR summary
    if (allData?.step4 && (allData?.step4?.hrServices || []).length > 0) {
      const services = allData.step4.hrServices || [];
      const serviceText = services.length > 3 
        ? 'Comprehensive HR Services' 
        : `HR: ${services.length} services`;
      
      summary.push(serviceText);
    }
    
    // Selected package
    if (allData?.step6?.selectedTier) {
      const tierLabels = {
        standard: 'Standard Package',
        premium: 'Premium Package',
        enterprise: 'Enterprise Package'
      };
      
      summary.push(`Selected Plan: ${tierLabels[allData.step6.selectedTier as keyof typeof tierLabels]}`);
    }
    
    return summary;
  };

  return (
    <div className="space-y-6">
      <FormSection title="Order Summary">
        <div className="bg-muted p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Reference ID</h3>
            <Badge variant="outline">{referenceId}</Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Selected Plan</h3>
            <Badge variant="default">
              {allData?.step6?.selectedTier === 'standard' && 'Standard'}
              {allData?.step6?.selectedTier === 'premium' && 'Premium'}
              {allData?.step6?.selectedTier === 'enterprise' && 'Enterprise'}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          {getServiceSummary().map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-1" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Pricing Details">
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Monthly Fee</span>
                <span className="font-medium">AED {pricing?.monthlyPrice?.toLocaleString() || '0'}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Annual Cost</span>
                <span>AED {pricing?.annualPrice?.toLocaleString() || '0'}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Setup Fee</span>
                <span>Included</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-xs font-semibold">Total Monthly Fee</span>
                <span className="text-xs font-semibold">AED {pricing?.monthlyPrice?.toLocaleString() || '0'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </FormSection>

      <FormSection title="What's Next">
        <div className="space-y-4">
          <p>Please review all details carefully. In the next step, you will provide your contact information to complete this order.</p>
          
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5" />
              <span>Our team will contact you within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5" />
              <span>Customized proposal based on your requirements</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5" />
              <span>Onboarding process and timeline discussion</span>
            </li>
          </ul>
        </div>
      </FormSection>
    </div>
  );
}