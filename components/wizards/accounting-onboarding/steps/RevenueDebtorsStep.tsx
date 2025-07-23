import React from 'react';
import FormSection from '../FormSection';
import { TextField, SelectField, TextareaField, RadioField, CheckboxField } from '../FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

const REVENUE_STREAMS = [
  'Product Sales', 'Service Revenue', 'Subscription Fees', 'License Fees', 
  'Consulting', 'Rental Income', 'Commission', 'Other'
];

export default function RevenueDebtorsStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection title="Revenue Streams">
        <div className="space-y-3">
          <h4 className="font-medium">Primary Revenue Sources (check all that apply)</h4>
          {REVENUE_STREAMS.map(stream => (
            <CheckboxField
              key={stream}
              label={stream}
              name={`revenue-${stream}`}
              checked={data.revenueStreams?.includes(stream)}
              onChange={(_, checked) => {
                const current = data.revenueStreams || [];
                if (checked) {
                  onChange({ ...data, revenueStreams: [...current, stream] });
                } else {
                  onChange({ ...data, revenueStreams: current.filter((s: string) => s !== stream) });
                }
              }}
            />
          ))}
        </div>

        <TextareaField
          label="Revenue Stream Details"
          name="revenueStreamDetails"
          value={data.revenueStreamDetails}
          onChange={updateField}
          placeholder="Describe each revenue stream, typical amounts, and seasonality"
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Largest Single Customer (% of revenue)"
            name="largestCustomerPercentage"
            value={data.largestCustomerPercentage}
            onChange={updateField}
            placeholder="25%"
          />
          <TextField
            label="Top 5 Customers (% of revenue)"
            name="top5CustomersPercentage"
            value={data.top5CustomersPercentage}
            onChange={updateField}
            placeholder="60%"
          />
        </div>
      </FormSection>

      <FormSection title="Invoicing Process">
        <RadioField
          label="Invoicing Frequency"
          name="invoicingFrequency"
          value={data.invoicingFrequency}
          onChange={updateField}
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'project-based', label: 'Project-based' },
            { value: 'other', label: 'Other' }
          ]}
        />

        <RadioField
          label="Invoice Approval Process"
          name="invoiceApproval"
          value={data.invoiceApproval}
          onChange={updateField}
          options={[
            { value: 'automatic', label: 'Automatic generation' },
            { value: 'manager-approval', label: 'Manager approval required' },
            { value: 'dual-approval', label: 'Dual approval required' }
          ]}
        />

        <TextareaField
          label="Invoicing Workflow"
          name="invoicingWorkflow"
          value={data.invoicingWorkflow}
          onChange={updateField}
          placeholder="Describe the complete invoicing process from order to payment"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Invoice Numbering"
            name="invoiceNumbering"
            value={data.invoiceNumbering}
            onChange={updateField}
            options={['Sequential', 'Date-based', 'Custom format']}
          />
          <TextField
            label="Standard Payment Terms"
            name="paymentTerms"
            value={data.paymentTerms}
            onChange={updateField}
            placeholder="e.g., Net 30"
          />
        </div>
      </FormSection>

      <FormSection title="Credit Management & Collections">
        <RadioField
          label="Credit Assessment Process"
          name="creditAssessment"
          value={data.creditAssessment}
          onChange={updateField}
          options={[
            { value: 'formal', label: 'Formal credit checks' },
            { value: 'basic', label: 'Basic assessment' },
            { value: 'none', label: 'No formal process' }
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Credit Limit Review Frequency"
            name="creditLimitReview"
            value={data.creditLimitReview}
            onChange={updateField}
            placeholder="e.g., Annually"
          />
          <TextField
            label="Debt Collection Process"
            name="debtCollection"
            value={data.debtCollection}
            onChange={updateField}
            placeholder="e.g., 30-60-90 day follow up"
          />
        </div>

        <TextareaField
          label="Bad Debt Policy"
          name="badDebtPolicy"
          value={data.badDebtPolicy}
          onChange={updateField}
          placeholder="When and how are bad debts written off?"
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Average Collection Period (days)"
            name="averageCollectionPeriod"
            value={data.averageCollectionPeriod}
            onChange={updateField}
            placeholder="45"
          />
          <TextField
            label="Bad Debt Percentage"
            name="badDebtPercentage"
            value={data.badDebtPercentage}
            onChange={updateField}
            placeholder="2%"
          />
        </div>
      </FormSection>

      <FormSection title="Credit Notes & Adjustments">
        <RadioField
          label="Credit Note Authorization"
          name="creditNoteAuth"
          value={data.creditNoteAuth}
          onChange={updateField}
          options={[
            { value: 'automatic', label: 'System automatic (returns)' },
            { value: 'manager', label: 'Manager approval required' },
            { value: 'senior', label: 'Senior management approval' }
          ]}
        />

        <TextField
          label="Credit Note Approval Threshold"
          name="creditNoteThreshold"
          value={data.creditNoteThreshold}
          onChange={updateField}
          placeholder="Amount requiring higher approval (AED)"
        />

        <TextareaField
          label="Common Credit Note Reasons"
          name="creditNoteReasons"
          value={data.creditNoteReasons}
          onChange={updateField}
          placeholder="List typical reasons for credit notes (returns, discounts, errors, etc.)"
          rows={2}
        />
      </FormSection>

      <FormSection title="Interest & Penalties">
        <RadioField
          label="Late Payment Interest"
          name="latePaymentInterest"
          value={data.latePaymentInterest}
          onChange={updateField}
          options={[
            { value: 'yes', label: 'Interest charged on overdue amounts' },
            { value: 'penalties', label: 'Penalties but no interest' },
            { value: 'no', label: 'No interest or penalties' }
          ]}
        />

        {data.latePaymentInterest === 'yes' && (
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Interest Rate (%)"
              name="interestRate"
              value={data.interestRate}
              onChange={updateField}
              placeholder="1.5% per month"
            />
            <TextField
              label="Grace Period (days)"
              name="gracePeriod"
              value={data.gracePeriod}
              onChange={updateField}
              placeholder="7"
            />
          </div>
        )}

        <TextareaField
          label="Interest Calculation Method"
          name="interestCalculation"
          value={data.interestCalculation}
          onChange={updateField}
          placeholder="How is interest calculated and applied?"
          rows={2}
        />
      </FormSection>
    </div>
  );
}