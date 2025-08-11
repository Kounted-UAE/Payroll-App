import React from 'react';
import FormSection from '@/components/ui/forms/FormSection';
import { RadioField, TextField } from '@/components/ui/forms/FormField';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface StepProps {
  data: any;
  allData?: any;
  onChange: (data: any) => void;
  onPricingChange?: (pricing: any) => void;
  pricing?: any;
  referenceId?: string;
}

const HR_SERVICES = [
  { value: 'visa_processing', label: 'Visa Processing' },
  { value: 'employment_contracts', label: 'Employment Contracts' },
  { value: 'onboarding_packs', label: 'Employee Onboarding Packs' },
  { value: 'hr_file_setup', label: 'HR File Setup & Maintenance' },
  { value: 'hrms_integration', label: 'HRMS or Employee Portal Integration' },
  { value: 'staff_handbook', label: 'Staff Handbook or Policies' }
];

export default function HRComplianceStep({ data, allData, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    const currentServices = data.hrServices || [];
    const updatedServices = checked
      ? [...currentServices, service]
      : currentServices.filter((s: string) => s !== service);
    
    updateField('hrServices', updatedServices);
  };

  // Skip this step if no employees
  if (allData?.step1?.employeeCount === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-blue-400">No employees indicated. Skipping HR & Compliance section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormSection title="HR Services">
        <div className="space-y-4">
          <p className="text-xs text-blue-200">Select the HR services you need:</p>
          
          <div className="space-y-3">
            {HR_SERVICES.map(service => (
              <div className="flex items-center space-x-2" key={service.value}>
                <Checkbox
                  id={`service-${service.value}`}
                  checked={(data.hrServices || []).includes(service.value)}
                  onCheckedChange={(checked) => 
                    handleServiceChange(service.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`service-${service.value}`}
                  className="text-xs font-normal cursor-pointer"
                >
                  {service.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </FormSection>

      <FormSection title="PRO Services">
        <RadioField
          label="PRO Service Frequency"
          name="proServiceFrequency"
          value={data.proServiceFrequency || ''}
          onChange={updateField}
          options={[
            { value: 'not_required', label: 'Not Required' },
            { value: 'on_demand', label: 'On Demand (as needed)' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Quarterly' }
          ]}
        />
        
        <TextField
          label="Specific PRO Services Needed"
          name="proServicesNeeded"
          value={data.proServicesNeeded || ''}
          onChange={updateField}
          placeholder="E.g., visa renewals, license renewals, document attestation"
        />
      </FormSection>

      <FormSection title="Compliance Requirements">
        <RadioField
          label="Employment Law Compliance"
          name="employmentLawCompliance"
          value={data.employmentLawCompliance || ''}
          onChange={updateField}
          options={[
            { value: 'full_service', label: 'Full Compliance Service' },
            { value: 'audit', label: 'Compliance Audit Only' },
            { value: 'not_required', label: 'Not Required' }
          ]}
        />
        
        <TextField
          label="Additional Compliance Requirements"
          name="additionalCompliance"
          value={data.additionalCompliance || ''}
          onChange={updateField}
          placeholder="Any specific compliance requirements or notes"
        />
      </FormSection>
    </div>
  );
}