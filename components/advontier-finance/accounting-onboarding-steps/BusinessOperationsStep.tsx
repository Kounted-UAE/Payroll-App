import React from 'react';
import FormSection from '@/components/ui/forms/FormSection';
import { TextField, SelectField, TextareaField, CheckboxField } from '@/components/ui/forms/FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 
  'Real Estate', 'Construction', 'Education', 'Hospitality', 'Other'
];

const CLIENT_SEGMENTS = [
  'B2B Enterprise', 'B2B SME', 'B2C Consumer', 'Government', 'Non-profit'
];

const SYSTEMS = [
  { value: 'pos', label: 'Point of Sale (POS)' },
  { value: 'erp', label: 'Enterprise Resource Planning (ERP)' },
  { value: 'crm', label: 'Customer Relationship Management (CRM)' },
  { value: 'inventory', label: 'Inventory Management' },
  { value: 'ecommerce', label: 'E-commerce Platform' },
  { value: 'accounting', label: 'Accounting Software' }
];

export default function BusinessOperationsStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  const updateSystemSelection = (systemValue: string, checked: boolean) => {
    const currentSystems = data.systems || [];
    if (checked) {
      onChange({ ...data, systems: [...currentSystems, systemValue] });
    } else {
      onChange({ ...data, systems: currentSystems.filter((s: string) => s !== systemValue) });
    }
  };

  return (
    <div className="space-y-6">
      <FormSection title="Industry & Activities">
        <SelectField
          label="Primary Industry"
          name="primaryIndustry"
          value={data.primaryIndustry}
          onChange={updateField}
          options={INDUSTRIES}
          required
        />

        <TextareaField
          label="Business Activities Description"
          name="businessActivities"
          value={data.businessActivities}
          onChange={updateField}
          placeholder="Describe the main business activities and services provided"
          rows={4}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Years in Operation"
            name="yearsInOperation"
            value={data.yearsInOperation}
            onChange={updateField}
            placeholder="5"
          />
          <TextField
            label="Number of Employees"
            name="numberOfEmployees"
            value={data.numberOfEmployees}
            onChange={updateField}
            placeholder="25"
          />
        </div>
      </FormSection>

      <FormSection title="Client Segments">
        <div className="space-y-3">
          {CLIENT_SEGMENTS.map(segment => (
            <CheckboxField
              key={segment}
              label={segment}
              name={`clientSegment-${segment}`}
              checked={data.clientSegments?.includes(segment)}
              onChange={(_, checked) => {
                const current = data.clientSegments || [];
                if (checked) {
                  onChange({ ...data, clientSegments: [...current, segment] });
                } else {
                  onChange({ ...data, clientSegments: current.filter((s: string) => s !== segment) });
                }
              }}
            />
          ))}
        </div>
      </FormSection>

      <FormSection title="Key Systems">
        <div className="space-y-3">
          {SYSTEMS.map(system => (
            <CheckboxField
              key={system.value}
              label={system.label}
              name={`system-${system.value}`}
              checked={data.systems?.includes(system.value)}
              onChange={(_, checked) => updateSystemSelection(system.value, checked)}
            />
          ))}
        </div>

        <TextareaField
          label="Other Systems"
          name="otherSystems"
          value={data.otherSystems}
          onChange={updateField}
          placeholder="List any other business systems or software used"
          rows={2}
        />
      </FormSection>

      <FormSection title="Revenue & Transactions">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Annual Revenue (AED)"
            name="annualRevenue"
            value={data.annualRevenue}
            onChange={updateField}
            placeholder="1000000"
          />
          <TextField
            label="Average Monthly Transactions"
            name="monthlyTransactions"
            value={data.monthlyTransactions}
            onChange={updateField}
            placeholder="500"
          />
        </div>

        <TextareaField
          label="Revenue Channels"
          name="revenueChannels"
          value={data.revenueChannels}
          onChange={updateField}
          placeholder="Describe primary revenue channels (e.g., direct sales, online, subscriptions)"
          rows={3}
        />
      </FormSection>
    </div>
  );
}