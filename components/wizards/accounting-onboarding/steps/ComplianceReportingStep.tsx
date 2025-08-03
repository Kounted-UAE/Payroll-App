import React from 'react';
import FormSection from '@/components/forms/FormSection';
import { TextField, TextareaField } from '@/components/forms/FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

export default function ComplianceReportingStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <FormSection title="Compliance">
      <TextField
        label="Tax Registration Number"
        name="taxRegistrationNumber"
        value={data.taxRegistrationNumber}
        onChange={updateField}
      />
      
      <TextareaField
        label="Key Filing Dates"
        name="keyFilingDates"
        value={data.keyFilingDates}
        onChange={updateField}
        placeholder="List important tax and regulatory filing dates"
        rows={3}
      />
    </FormSection>
  );
}