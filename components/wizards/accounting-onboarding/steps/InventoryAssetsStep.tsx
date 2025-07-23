import React from 'react';
import FormSection from '../FormSection';
import { TextField, SelectField, TextareaField, RadioField } from '../FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

export default function InventoryAssetsStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection title="Inventory Management">
        <TextareaField
          label="Inventory Description"
          name="inventoryDescription"
          value={data.inventoryDescription}
          onChange={updateField}
          placeholder="Describe types of inventory held"
          rows={3}
        />
        
        <RadioField
          label="Inventory Tracking"
          name="inventoryTracking"
          value={data.inventoryTracking}
          onChange={updateField}
          options={[
            { value: 'perpetual', label: 'Perpetual system' },
            { value: 'periodic', label: 'Periodic system' },
            { value: 'manual', label: 'Manual tracking' }
          ]}
        />
      </FormSection>

      <FormSection title="Fixed Assets">
        <RadioField
          label="Asset Register"
          name="assetRegister"
          value={data.assetRegister}
          onChange={updateField}
          options={[
            { value: 'comprehensive', label: 'Comprehensive register' },
            { value: 'basic', label: 'Basic tracking' },
            { value: 'none', label: 'No formal register' }
          ]}
        />
      </FormSection>
    </div>
  );
}