import React from 'react';
import FormSection from '@/components/forms/FormSection';
import { RadioField, TextField } from '@/components/forms/FormField';

interface StepProps {
  data: any;
  allData?: any;
  onChange: (data: any) => void;
  onPricingChange?: (pricing: any) => void;
  pricing?: any;
  referenceId?: string;
}

export default function TaxServicesStep({ data, allData, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  const isVatRegistered = allData?.step2?.vatRegistered === 'yes';

  return (
    <div className="space-y-6">
      <FormSection title="VAT Registration Status">
        <RadioField
          label="VAT Registration Status"
          name="vatRegistration"
          value={data.vatRegistration || (isVatRegistered ? 'registered' : '')}
          onChange={updateField}
          options={[
            { value: 'registered', label: 'Already Registered' },
            { value: 'not_registered', label: 'Not Registered' },
            { value: 'need_registration', label: 'Need Registration Service' },
            { value: 'not_required', label: 'Not Required (Below Threshold)' }
          ]}
          required
        />
        
        {(data.vatRegistration === 'registered' || isVatRegistered) && (
          <RadioField
            label="VAT Return Filing"
            name="vatReturnFiling"
            value={data.vatReturnFiling || ''}
            onChange={updateField}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'annually', label: 'Annually' }
            ]}
            required
          />
        )}
      </FormSection>

      <FormSection title="Corporate Tax">
        <RadioField
          label="Corporate Tax Registration"
          name="ctRegistration"
          value={data.ctRegistration || ''}
          onChange={updateField}
          options={[
            { value: 'registered', label: 'Already Registered' },
            { value: 'need_registration', label: 'Need Registration Service' },
            { value: 'not_required', label: 'Not Required' }
          ]}
          required
        />
        
        <RadioField
          label="Free Zone Exemption Filing"
          name="freeZoneExemption"
          value={data.freeZoneExemption || ''}
          onChange={updateField}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]}
        />
        
        <RadioField
          label="Transfer Pricing Documentation"
          name="transferPricing"
          value={data.transferPricing || ''}
          onChange={updateField}
          options={[
            { value: 'required', label: 'Required' },
            { value: 'not_required', label: 'Not Required' },
            { value: 'unsure', label: 'Not Sure' }
          ]}
        />
      </FormSection>

      <FormSection title="Tax Advisory & Special Needs">
        <RadioField
          label="Tax Advisory Services"
          name="taxAdvisory"
          value={data.taxAdvisory || ''}
          onChange={updateField}
          options={[
            { value: 'ongoing', label: 'Ongoing Advisory' },
            { value: 'one_time', label: 'One-Time Consultation' },
            { value: 'not_required', label: 'Not Required' }
          ]}
        />
        
        <RadioField
          label="Voluntary Disclosures / Penalties"
          name="voluntaryDisclosures"
          value={data.voluntaryDisclosures || ''}
          onChange={updateField}
          options={[
            { value: 'yes', label: 'Yes - Assistance Needed' },
            { value: 'no', label: 'No - Not Applicable' }
          ]}
        />
        
        <TextField
          label="Special Tax Requirements"
          name="specialTaxRequirements"
          value={data.specialTaxRequirements || ''}
          onChange={updateField}
          placeholder="Any specific tax requirements or concerns"
        />
      </FormSection>
    </div>
  );
}