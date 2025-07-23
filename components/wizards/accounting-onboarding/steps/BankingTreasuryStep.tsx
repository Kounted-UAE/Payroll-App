import React from 'react';
import FormSection from '../FormSection';
import { TextField, RadioField, TextareaField } from '../FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

export default function BankingTreasuryStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection title="Banking">
        <TextField
          label="Number of Bank Accounts"
          name="numberOfBankAccounts"
          value={data.numberOfBankAccounts}
          onChange={updateField}
          placeholder="3"
        />
        
        <RadioField
          label="EFT Controls"
          name="eftControls"
          value={data.eftControls}
          onChange={updateField}
          options={[
            { value: 'dual-approval', label: 'Dual approval required' },
            { value: 'single-approval', label: 'Single approval' },
            { value: 'automated', label: 'Automated payments' }
          ]}
        />
      </FormSection>
    </div>
  );
}