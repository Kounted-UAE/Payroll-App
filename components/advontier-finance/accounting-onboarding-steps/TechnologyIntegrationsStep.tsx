import React from 'react';
import FormSection from '@/components/ui/forms/FormSection';
import { TextareaField } from '@/components/ui/forms/FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

export default function TechnologyIntegrationsStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <FormSection title="Technology">
      <TextareaField
        label="Core Systems"
        name="coreSystems"
        value={data.coreSystems}
        onChange={updateField}
        placeholder="List main technology systems"
        rows={3}
      />
    </FormSection>
  );
}