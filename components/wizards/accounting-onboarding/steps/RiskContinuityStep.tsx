import React from 'react';
import FormSection from '../FormSection';
import { TextareaField } from '../FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

export default function RiskContinuityStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <FormSection title="Risk & Continuity">
      <TextareaField
        label="Business Risks"
        name="businessRisks"
        value={data.businessRisks}
        onChange={updateField}
        placeholder="Identify key business risks"
        rows={4}
      />
    </FormSection>
  );
}