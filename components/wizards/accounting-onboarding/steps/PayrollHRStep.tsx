import React from 'react';
import FormSection from '../FormSection';
import { TextField, SelectField, TextareaField, RadioField, CheckboxField } from '../FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

const PAYROLL_TOOLS = [
  'Internal system', 'ADP', 'PayChex', 'QuickBooks Payroll', 'Sage Payroll', 'Other'
];

export default function PayrollHRStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection title="Payroll System & Processing">
        <SelectField
          label="Payroll Processing Tool"
          name="payrollTool"
          value={data.payrollTool}
          onChange={updateField}
          options={PAYROLL_TOOLS}
          required
        />

        {data.payrollTool === 'Other' && (
          <TextField
            label="Other Payroll Tool Details"
            name="otherPayrollTool"
            value={data.otherPayrollTool}
            onChange={updateField}
            placeholder="Specify the payroll system"
          />
        )}

        <RadioField
          label="Payroll Processing"
          name="payrollProcessing"
          value={data.payrollProcessing}
          onChange={updateField}
          options={[
            { value: 'internal', label: 'Processed internally' },
            { value: 'outsourced', label: 'Outsourced to payroll company' },
            { value: 'hybrid', label: 'Hybrid approach' }
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Payroll Frequency"
            name="payrollFrequency"
            value={data.payrollFrequency}
            onChange={updateField}
            options={['Weekly', 'Bi-weekly', 'Monthly', 'Twice monthly']}
            required
          />
          <TextField
            label="Total Number of Employees"
            name="totalEmployees"
            value={data.totalEmployees}
            onChange={updateField}
            placeholder="25"
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <TextField
            label="Full-time Employees"
            name="fullTimeEmployees"
            value={data.fullTimeEmployees}
            onChange={updateField}
            placeholder="20"
          />
          <TextField
            label="Part-time Employees"
            name="partTimeEmployees"
            value={data.partTimeEmployees}
            onChange={updateField}
            placeholder="3"
          />
          <TextField
            label="Contract/Temporary"
            name="contractEmployees"
            value={data.contractEmployees}
            onChange={updateField}
            placeholder="2"
          />
        </div>
      </FormSection>

      <FormSection title="Compensation Structure">
        <div className="space-y-3">
          <h4 className="font-medium">Compensation Components (check all that apply)</h4>
          {['Base salary', 'Hourly wages', 'Commission', 'Overtime', 'Bonuses', 'Benefits', 'Allowances'].map(comp => (
            <CheckboxField
              key={comp}
              label={comp}
              name={`compensation-${comp}`}
              checked={data.compensationComponents?.includes(comp)}
              onChange={(_, checked) => {
                const current = data.compensationComponents || [];
                if (checked) {
                  onChange({ ...data, compensationComponents: [...current, comp] });
                } else {
                  onChange({ ...data, compensationComponents: current.filter((c: string) => c !== comp) });
                }
              }}
            />
          ))}
        </div>

        <TextareaField
          label="Bonus Policy"
          name="bonusPolicy"
          value={data.bonusPolicy}
          onChange={updateField}
          placeholder="Describe bonus structure, criteria, and payment timing"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <RadioField
            label="Overtime Policy"
            name="overtimePolicy"
            value={data.overtimePolicy}
            onChange={updateField}
            options={[
              { value: 'time-and-half', label: 'Time and a half' },
              { value: 'double-time', label: 'Double time' },
              { value: 'comp-time', label: 'Compensatory time' },
              { value: 'not-applicable', label: 'Not applicable' }
            ]}
          />
          <TextField
            label="Standard Work Week (hours)"
            name="standardWorkWeek"
            value={data.standardWorkWeek}
            onChange={updateField}
            placeholder="40"
          />
        </div>
      </FormSection>

      <FormSection title="Leave Management">
        <RadioField
          label="Leave Tracking System"
          name="leaveTrackingSystem"
          value={data.leaveTrackingSystem}
          onChange={updateField}
          options={[
            { value: 'automated', label: 'Automated system' },
            { value: 'manual', label: 'Manual tracking' },
            { value: 'hybrid', label: 'Combination' }
          ]}
        />

        <div className="grid grid-cols-3 gap-4">
          <TextField
            label="Annual Leave Days"
            name="annualLeaveDays"
            value={data.annualLeaveDays}
            onChange={updateField}
            placeholder="21"
          />
          <TextField
            label="Sick Leave Days"
            name="sickLeaveDays"
            value={data.sickLeaveDays}
            onChange={updateField}
            placeholder="10"
          />
          <TextField
            label="Personal Leave Days"
            name="personalLeaveDays"
            value={data.personalLeaveDays}
            onChange={updateField}
            placeholder="5"
          />
        </div>

        <TextareaField
          label="Leave Policies"
          name="leavePolicies"
          value={data.leavePolicies}
          onChange={updateField}
          placeholder="Describe leave accrual, carryover, and approval policies"
          rows={3}
        />
      </FormSection>

      <FormSection title="Employment Documentation">
        <RadioField
          label="Employment Contracts"
          name="employmentContracts"
          value={data.employmentContracts}
          onChange={updateField}
          options={[
            { value: 'written-all', label: 'Written contracts for all employees' },
            { value: 'written-some', label: 'Written contracts for some employees' },
            { value: 'verbal', label: 'Primarily verbal agreements' }
          ]}
        />

        <div className="space-y-3">
          <h4 className="font-medium">HR Documentation Maintained (check all that apply)</h4>
          {['Employee files', 'Job descriptions', 'Performance reviews', 'Training records', 'Disciplinary records'].map(doc => (
            <CheckboxField
              key={doc}
              label={doc}
              name={`hr-doc-${doc}`}
              checked={data.hrDocumentation?.includes(doc)}
              onChange={(_, checked) => {
                const current = data.hrDocumentation || [];
                if (checked) {
                  onChange({ ...data, hrDocumentation: [...current, doc] });
                } else {
                  onChange({ ...data, hrDocumentation: current.filter((d: string) => d !== doc) });
                }
              }}
            />
          ))}
        </div>

        <RadioField
          label="Background Check Policy"
          name="backgroundCheckPolicy"
          value={data.backgroundCheckPolicy}
          onChange={updateField}
          options={[
            { value: 'all-employees', label: 'Required for all employees' },
            { value: 'certain-positions', label: 'Required for certain positions' },
            { value: 'not-required', label: 'Not required' }
          ]}
        />
      </FormSection>

      <FormSection title="Time Tracking & Attendance">
        <RadioField
          label="Time Tracking Method"
          name="timeTrackingMethod"
          value={data.timeTrackingMethod}
          onChange={updateField}
          options={[
            { value: 'electronic', label: 'Electronic time clock/system' },
            { value: 'manual', label: 'Manual timesheets' },
            { value: 'honor-system', label: 'Honor system' },
            { value: 'mixed', label: 'Mixed methods' }
          ]}
        />

        <TextareaField
          label="Shift Tracking Logic"
          name="shiftTrackingLogic"
          value={data.shiftTrackingLogic}
          onChange={updateField}
          placeholder="Describe how shifts, breaks, and overtime are tracked and calculated"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <RadioField
            label="Attendance Monitoring"
            name="attendanceMonitoring"
            value={data.attendanceMonitoring}
            onChange={updateField}
            options={[
              { value: 'strict', label: 'Strict monitoring' },
              { value: 'flexible', label: 'Flexible arrangement' },
              { value: 'basic', label: 'Basic tracking' }
            ]}
          />
          <TextField
            label="Tardiness Policy"
            name="tardinessPolicy"
            value={data.tardinessPolicy}
            onChange={updateField}
            placeholder="Grace period and consequences"
          />
        </div>
      </FormSection>

      <FormSection title="Additional Benefits & Policies">
        <RadioField
          label="Staff Loans Policy"
          name="staffLoansPolicy"
          value={data.staffLoansPolicy}
          onChange={updateField}
          options={[
            { value: 'available', label: 'Staff loans available' },
            { value: 'emergency-only', label: 'Emergency advances only' },
            { value: 'not-available', label: 'Not available' }
          ]}
        />

        {data.staffLoansPolicy === 'available' && (
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Maximum Loan Amount (AED)"
              name="maxLoanAmount"
              value={data.maxLoanAmount}
              onChange={updateField}
              placeholder="5000"
            />
            <TextField
              label="Loan Approval Authority"
              name="loanApprovalAuthority"
              value={data.loanApprovalAuthority}
              onChange={updateField}
              placeholder="HR Manager / CEO"
            />
          </div>
        )}

        <RadioField
          label="Cash Wage Payments"
          name="cashWagePayments"
          value={data.cashWagePayments}
          onChange={updateField}
          options={[
            { value: 'never', label: 'Never paid in cash' },
            { value: 'rare-circumstances', label: 'Only in rare circumstances' },
            { value: 'some-employees', label: 'Some employees paid in cash' }
          ]}
        />

        <TextareaField
          label="Employee Benefits Summary"
          name="employeeBenefits"
          value={data.employeeBenefits}
          onChange={updateField}
          placeholder="List health insurance, retirement plans, and other benefits provided"
          rows={3}
        />

        <TextareaField
          label="HR Compliance Notes"
          name="hrComplianceNotes"
          value={data.hrComplianceNotes}
          onChange={updateField}
          placeholder="Any specific HR compliance requirements or challenges"
          rows={2}
        />
      </FormSection>
    </div>
  );
}