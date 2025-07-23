import React from 'react';
import FormSection from '@/components/wizards/FormSection';
import { TextField, SelectField, RadioField } from '@/components/wizards/FormField';
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

const TRANSACTION_VOLUMES = [
  { value: 'low', label: 'Low (< 100 per month)' },
  { value: 'medium', label: 'Medium (100-300 per month)' },
  { value: 'high', label: 'High (301-1000 per month)' },
  { value: 'very_high', label: 'Very High (1000+ per month)' }
];

const SALES_CHANNELS = [
  { value: 'pos', label: 'Point of Sale (POS)' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'b2b', label: 'B2B Invoicing' },
  { value: 'marketplace', label: 'Online Marketplace' },
  { value: 'direct', label: 'Direct Sales' }
];

export default function AccountingScopeStep({ data, allData, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  const handleSalesChannelChange = (channel: string, checked: boolean) => {
    const currentChannels = data.salesChannels || [];
    const updatedChannels = checked
      ? [...currentChannels, channel]
      : currentChannels.filter((c: string) => c !== channel);
    
    updateField('salesChannels', updatedChannels);
  };

  return (
    <div className="space-y-6">
      <FormSection title="Transaction Volume & Complexity">
        <SelectField
          label="Monthly Transaction Volume"
          name="transactionVolume"
          value={data.transactionVolume || ''}
          onChange={updateField}
          options={TRANSACTION_VOLUMES}
          required
          description="This includes sales invoices, purchase invoices, bank transactions, etc."
        />
        
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Number of Bank Accounts"
            name="bankAccountsCount"
            value={data.bankAccountsCount || ''}
            onChange={updateField}
            placeholder="e.g., 2"
            required
          />
          
          <SelectField
            label="Number of Currencies"
            name="currencyCount"
            value={data.currencyCount || ''}
            onChange={updateField}
            options={[
              { value: '1', label: 'Single Currency (AED)' },
              { value: '2-3', label: '2-3 Currencies' },
              { value: '4+', label: '4+ Currencies' }
            ]}
          />
        </div>
      </FormSection>

      <FormSection title="Sales Channels">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Select all sales channels that apply:</p>
          
          <div className="space-y-3">
            {SALES_CHANNELS.map(channel => (
              <div className="flex items-center space-x-2" key={channel.value}>
                <Checkbox
                  id={`channel-${channel.value}`}
                  checked={(data.salesChannels || []).includes(channel.value)}
                  onCheckedChange={(checked) => 
                    handleSalesChannelChange(channel.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`channel-${channel.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {channel.label}
                </Label>
              </div>
            ))}
          </div>
          
          <TextField
            label="Other Sales Channels"
            name="otherSalesChannels"
            value={data.otherSalesChannels || ''}
            onChange={updateField}
            placeholder="Please specify if any other sales channels"
          />
        </div>
      </FormSection>

      <FormSection title="VAT & Reporting">
        <div className="grid grid-cols-2 gap-4">
          <RadioField
            label="VAT Registered"
            name="vatRegistered"
            value={data.vatRegistered || ''}
            onChange={updateField}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'in_process', label: 'In Process' }
            ]}
            required
          />
          
          {data.vatRegistered === 'yes' && (
            <SelectField
              label="VAT Return Frequency"
              name="vatReturnFrequency"
              value={data.vatReturnFrequency || ''}
              onChange={updateField}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'annual', label: 'Annual' }
              ]}
              required
            />
          )}
        </div>
        
        <TextField
          label="Backlog Months (if any)"
          name="backlogMonths"
          value={data.backlogMonths || ''}
          onChange={updateField}
          placeholder="e.g., 3 months of unprocessed transactions"
          description="If you have unprocessed transactions or bookkeeping that needs to be caught up"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <RadioField
            label="Audit Required"
            name="auditRequired"
            value={data.auditRequired || ''}
            onChange={updateField}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'unsure', label: 'Not Sure' }
            ]}
          />
          
          <RadioField
            label="Management Reports Needed"
            name="misReportsRequired"
            value={data.misReportsRequired || ''}
            onChange={updateField}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'annual', label: 'Annual' },
              { value: 'no', label: 'Not Required' }
            ]}
          />
        </div>
      </FormSection>

      <FormSection title="Additional Accounting Details">
        <div className="grid grid-cols-2 gap-4">
          <RadioField
            label="Accounting System Setup"
            name="accountingSystemSetup"
            value={data.accountingSystemSetup || ''}
            onChange={updateField}
            options={[
              { value: 'new', label: 'Need New Setup' },
              { value: 'existing', label: 'Already Setup' },
              { value: 'migration', label: 'Migration Needed' }
            ]}
          />
          
          <RadioField
            label="Chart of Accounts"
            name="chartOfAccounts"
            value={data.chartOfAccounts || ''}
            onChange={updateField}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'custom', label: 'Custom Required' }
            ]}
          />
        </div>
        
        <TextField
          label="Additional Accounting Requirements"
          name="additionalAccountingRequirements"
          value={data.additionalAccountingRequirements || ''}
          onChange={updateField}
          placeholder="Any specific accounting requirements or notes"
        />
      </FormSection>
    </div>
  );
}