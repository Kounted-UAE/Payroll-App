import React from 'react';
import FormSection from '../FormSection';
import { TextField, SelectField, TextareaField, RadioField } from '../FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

const ACCOUNTING_SOFTWARE = [
  'QuickBooks', 'Xero', 'SAP', 'Oracle NetSuite', 'Sage', 'Tally', 'Zoho Books', 'Other'
];

const REPORTING_FREQUENCY = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
  { value: 'custom', label: 'Custom Schedule' }
];

export default function FinancialControlsStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection title="Accounting Software & Systems">
        <SelectField
          label="Primary Accounting Software"
          name="accountingSoftware"
          value={data.accountingSoftware}
          onChange={updateField}
          options={ACCOUNTING_SOFTWARE}
          required
        />

        {data.accountingSoftware === 'Other' && (
          <TextField
            label="Other Software Details"
            name="otherAccountingSoftware"
            value={data.otherAccountingSoftware}
            onChange={updateField}
            placeholder="Specify the accounting software"
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Software Version"
            name="softwareVersion"
            value={data.softwareVersion}
            onChange={updateField}
            placeholder="e.g., QuickBooks Pro 2024"
          />
          <SelectField
            label="Deployment"
            name="deployment"
            value={data.deployment}
            onChange={updateField}
            options={['Cloud-based', 'On-premise', 'Hybrid']}
          />
        </div>

        <TextareaField
          label="Integration Details"
          name="integrationDetails"
          value={data.integrationDetails}
          onChange={updateField}
          placeholder="Describe integrations with other systems (banking, POS, inventory, etc.)"
          rows={3}
        />
      </FormSection>

      <FormSection title="Access Control & User Management">
        <TextareaField
          label="User Role Matrix"
          name="userRoleMatrix"
          value={data.userRoleMatrix}
          onChange={updateField}
          placeholder="Describe user roles and access levels (e.g., Admin, Accountant, Viewer, etc.)"
          rows={4}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Number of Licensed Users"
            name="licensedUsers"
            value={data.licensedUsers}
            onChange={updateField}
            placeholder="5"
          />
          <SelectField
            label="Multi-factor Authentication"
            name="mfaEnabled"
            value={data.mfaEnabled}
            onChange={updateField}
            options={['Yes', 'No', 'Partial']}
          />
        </div>
      </FormSection>

      <FormSection title="Journal Entry & Approval Workflow">
        <RadioField
          label="Journal Entry Approval Required"
          name="journalApprovalRequired"
          value={data.journalApprovalRequired}
          onChange={updateField}
          options={[
            { value: 'always', label: 'Always required' },
            { value: 'above-threshold', label: 'Above certain threshold' },
            { value: 'never', label: 'Not required' }
          ]}
        />

        {data.journalApprovalRequired === 'above-threshold' && (
          <TextField
            label="Approval Threshold (AED)"
            name="approvalThreshold"
            value={data.approvalThreshold}
            onChange={updateField}
            placeholder="1000"
          />
        )}

        <TextareaField
          label="Journal Entry Workflow"
          name="journalWorkflow"
          value={data.journalWorkflow}
          onChange={updateField}
          placeholder="Describe the process for creating, reviewing, and approving journal entries"
          rows={3}
        />

        <TextField
          label="Journal Entry Retention Period"
          name="journalRetentionPeriod"
          value={data.journalRetentionPeriod}
          onChange={updateField}
          placeholder="e.g., 7 years"
        />
      </FormSection>

      <FormSection title="Financial Reporting & Budgeting">
        <div className="grid grid-cols-2 gap-4">
          <RadioField
            label="Management Reporting Frequency"
            name="reportingFrequency"
            value={data.reportingFrequency}
            onChange={updateField}
            options={REPORTING_FREQUENCY}
          />

          <RadioField
            label="Budget Preparation Cycle"
            name="budgetCycle"
            value={data.budgetCycle}
            onChange={updateField}
            options={[
              { value: 'annual', label: 'Annual' },
              { value: 'quarterly', label: 'Quarterly' },
              { value: 'rolling', label: 'Rolling forecast' }
            ]}
          />
        </div>

        <TextareaField
          label="Key Financial Reports Generated"
          name="keyReports"
          value={data.keyReports}
          onChange={updateField}
          placeholder="List the main financial reports produced (P&L, Balance Sheet, Cash Flow, etc.)"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Report Distribution List"
            name="reportDistribution"
            value={data.reportDistribution}
            onChange={updateField}
            placeholder="Who receives the financial reports"
          />
          <TextField
            label="Reporting Deadline"
            name="reportingDeadline"
            value={data.reportingDeadline}
            onChange={updateField}
            placeholder="e.g., 15th of following month"
          />
        </div>

        <TextareaField
          label="Budget vs Actual Analysis"
          name="budgetAnalysis"
          value={data.budgetAnalysis}
          onChange={updateField}
          placeholder="Describe the process for budget vs actual variance analysis"
          rows={2}
        />
      </FormSection>
    </div>
  );
}