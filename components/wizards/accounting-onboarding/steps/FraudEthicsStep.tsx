import React from 'react';
import FormSection from '../FormSection';
import { SelectField, TextareaField, RadioField, CheckboxField } from '../FormField';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

const RISK_LEVELS = [
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' }
];

export default function FraudEthicsStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="space-y-6">
      <FormSection title="Risk Assessment">
        <RadioField
          label="Overall Fraud Risk Level"
          name="fraudRiskLevel"
          value={data.fraudRiskLevel}
          onChange={updateField}
          options={RISK_LEVELS}
          description="Based on industry, size, complexity, and controls"
        />

        <TextareaField
          label="Risk Factors Identified"
          name="riskFactors"
          value={data.riskFactors}
          onChange={updateField}
          placeholder="List specific risk factors (e.g., cash handling, inventory, high-value transactions)"
          rows={4}
        />

        <TextareaField
          label="Risk Assessment Methodology"
          name="riskMethodology"
          value={data.riskMethodology}
          onChange={updateField}
          placeholder="Describe how fraud risks are assessed and monitored"
          rows={3}
        />
      </FormSection>

      <FormSection title="Incident History">
        <RadioField
          label="Known Fraud Incidents"
          name="knownIncidents"
          value={data.knownIncidents}
          onChange={updateField}
          options={[
            { value: 'none', label: 'No known incidents' },
            { value: 'minor', label: 'Minor incidents (resolved)' },
            { value: 'significant', label: 'Significant incidents' }
          ]}
        />

        {data.knownIncidents !== 'none' && (
          <TextareaField
            label="Incident Details"
            name="incidentDetails"
            value={data.incidentDetails}
            onChange={updateField}
            placeholder="Provide details of past incidents and actions taken"
            rows={4}
          />
        )}

        <TextareaField
          label="Lessons Learned"
          name="lessonsLearned"
          value={data.lessonsLearned}
          onChange={updateField}
          placeholder="How have controls been improved based on past experiences?"
          rows={3}
        />
      </FormSection>

      <FormSection title="Control Measures">
        <div className="space-y-4">
          <h4 className="font-medium">Existing Controls (check all that apply)</h4>
          
          {[
            'Segregation of duties',
            'Dual authorization for payments',
            'Regular reconciliations',
            'Management review and approval',
            'System access controls',
            'Physical security measures',
            'Background checks for employees',
            'Regular internal audits',
            'Whistleblower policy',
            'Code of conduct'
          ].map(control => (
            <CheckboxField
              key={control}
              label={control}
              name={`control-${control.replace(/\s+/g, '-').toLowerCase()}`}
              checked={data.controls?.includes(control)}
              onChange={(_, checked) => {
                const current = data.controls || [];
                if (checked) {
                  onChange({ ...data, controls: [...current, control] });
                } else {
                  onChange({ ...data, controls: current.filter((c: string) => c !== control) });
                }
              }}
            />
          ))}
        </div>

        <TextareaField
          label="Additional Controls"
          name="additionalControls"
          value={data.additionalControls}
          onChange={updateField}
          placeholder="Describe any other fraud prevention controls in place"
          rows={3}
        />

        <TextareaField
          label="Control Testing & Monitoring"
          name="controlTesting"
          value={data.controlTesting}
          onChange={updateField}
          placeholder="How are controls tested and monitored for effectiveness?"
          rows={3}
        />
      </FormSection>

      <FormSection title="Ethics & Communication">
        <RadioField
          label="Code of Conduct"
          name="codeOfConduct"
          value={data.codeOfConduct}
          onChange={updateField}
          options={[
            { value: 'comprehensive', label: 'Comprehensive written policy' },
            { value: 'basic', label: 'Basic guidelines' },
            { value: 'informal', label: 'Informal understanding' },
            { value: 'none', label: 'No formal code' }
          ]}
        />

        <RadioField
          label="Ethics Training"
          name="ethicsTraining"
          value={data.ethicsTraining}
          onChange={updateField}
          options={[
            { value: 'regular', label: 'Regular formal training' },
            { value: 'onboarding', label: 'Only during onboarding' },
            { value: 'informal', label: 'Informal guidance' },
            { value: 'none', label: 'No formal training' }
          ]}
        />

        <TextareaField
          label="Communication Methods"
          name="communicationMethods"
          value={data.communicationMethods}
          onChange={updateField}
          placeholder="How are ethical standards and expectations communicated to employees?"
          rows={3}
        />

        <RadioField
          label="Reporting Mechanism"
          name="reportingMechanism"
          value={data.reportingMechanism}
          onChange={updateField}
          options={[
            { value: 'formal', label: 'Formal whistleblower system' },
            { value: 'open-door', label: 'Open door policy' },
            { value: 'informal', label: 'Informal reporting only' }
          ]}
        />

        <TextareaField
          label="Response Protocol"
          name="responseProtocol"
          value={data.responseProtocol}
          onChange={updateField}
          placeholder="How are fraud allegations investigated and handled?"
          rows={3}
        />
      </FormSection>
    </div>
  );
}