import React from 'react';
import FormSection from '@/components/ui/forms/FormSection';
import { TextField, SelectField, RadioField } from '@/components/ui/forms/FormField';

interface StepProps {
  data: any;
  allData?: any;
  onChange: (data: any) => void;
  onPricingChange?: (pricing: any) => void;
  pricing?: any;
  referenceId?: string;
}

export default function PayrollScopeStep({ data, allData, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  // Skip this step if no employees
  if (allData?.step1?.employeeCount === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No employees indicated. Skipping payroll section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormSection title="Employee Information">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Number of Employees"
            name="employeeCount"
            value={data.employeeCount || allData?.step1?.employeeCount || ''}
            onChange={updateField}
            required
          />
          
          <SelectField
            label="Pay Frequency"
            name="payFrequency"
            value={data.payFrequency || ''}
            onChange={updateField}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'biweekly', label: 'Bi-weekly' },
              { value: 'weekly', label: 'Weekly' }
            ]}
            required
          />
        </div>
      </FormSection>

      <FormSection title="Payroll Processing">
        <RadioField
          label="WPS (Wage Protection System) Integration Required"
          name="wpsIntegration"
          value={data.wpsIntegration || ''}
          onChange={updateField}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]}
          required
        />
        
        <RadioField
          label="End-of-Service Gratuity Calculation"
          name="eosgCalculation"
          value={data.eosgCalculation || ''}
          onChange={updateField}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]}
        />
        
        <RadioField
          label="Leave Tracking Required"
          name="leaveTracking"
          value={data.leaveTracking || ''}
          onChange={updateField}
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' }
          ]}
        />
      </FormSection>

      <FormSection title="Additional Payroll Features">
        <div className="grid grid-cols-2 gap-4">
          <RadioField
            label="Multi-Currency Salary Split"
            name="multiCurrencySalary"
            value={data.multiCurrencySalary || ''}
            onChange={updateField}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
          
          <RadioField
            label="Expense Reimbursements"
            name="expenseReimbursements"
            value={data.expenseReimbursements || ''}
            onChange={updateField}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ]}
          />
        </div>
        
        <TextField
          label="Special Payroll Requirements"
          name="specialRequirements"
          value={data.specialRequirements || ''}
          onChange={updateField}
          placeholder="Any special requirements or notes for payroll processing"
        />
      </FormSection>
    </div>
  );
}