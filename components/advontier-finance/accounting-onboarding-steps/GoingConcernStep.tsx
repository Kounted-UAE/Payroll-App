import React from 'react';
import FormSection from '@/components/ui/forms/FormSection';
import { RadioField, TextareaField } from '@/components/ui/forms/FormField';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

const GOING_CONCERN_INDICATORS = [
  'Net liabilities or net current liabilities',
  'Fixed-term borrowings approaching maturity without realistic refinancing',
  'Indications of withdrawal of financial support by creditors',
  'Negative operating cash flows in recent periods',
  'Adverse key financial ratios',
  'Substantial operating losses or significant deterioration',
  'Arrears or discontinuance of dividends',
  'Inability to pay creditors on due dates',
  'Inability to comply with terms of loan agreements',
  'Change from credit to cash-on-delivery transactions with suppliers',
  'Inability to obtain financing for essential new product development',
  'Loss of key management without replacement',
  'Loss of a major market, key customer(s), franchise, license, or principal supplier(s)',
  'Labor difficulties',
  'Shortages of important supplies',
  'Emergence of a highly successful competitor'
];

export default function GoingConcernStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  const updateIndicator = (indicator: string, status: string) => {
    const indicators = { ...data.indicators };
    indicators[indicator] = status;
    onChange({ ...data, indicators });
  };

  return (
    <div className="space-y-6">
      <FormSection 
        title="Going Concern Assessment" 
        description="Review each indicator and select the appropriate status"
      >
        <div className="space-y-6">
          {GOING_CONCERN_INDICATORS.map((indicator, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="mb-3">
                <h4 className="font-medium text-xs mb-2">{indicator}</h4>
              </div>
              
              <RadioField
                label=""
                name={`indicator-${index}`}
                value={data.indicators?.[indicator] || ''}
                onChange={(_, value) => updateIndicator(indicator, value)}
                options={[
                  { value: 'no', label: 'Not applicable/No concern' },
                  { value: 'yes', label: 'Concern identified' },
                  { value: 'mitigated', label: 'Concern identified but mitigated' }
                ]}
              />

              {(data.indicators?.[indicator] === 'yes' || data.indicators?.[indicator] === 'mitigated') && (
                <div className="mt-3">
                  <TextareaField
                    label="Explanation"
                    name={`explanation-${index}`}
                    value={data.explanations?.[indicator] || ''}
                    onChange={(_, value) => {
                      const explanations = { ...data.explanations };
                      explanations[indicator] = value;
                      onChange({ ...data, explanations });
                    }}
                    placeholder="Provide details about the concern and any mitigation measures"
                    rows={2}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Overall Assessment">
        <RadioField
          label="Overall Going Concern Conclusion"
          name="overallConclusion"
          value={data.overallConclusion}
          onChange={updateField}
          options={[
            { value: 'no-concerns', label: 'No significant going concern issues identified' },
            { value: 'some-concerns', label: 'Some concerns identified but adequately mitigated' },
            { value: 'material-uncertainty', label: 'Material uncertainty exists' }
          ]}
        />

        <TextareaField
          label="Management's Assessment"
          name="managementAssessment"
          value={data.managementAssessment}
          onChange={updateField}
          placeholder="Summarize management's assessment of the entity's ability to continue as a going concern"
          rows={4}
        />

        <TextareaField
          label="Key Mitigation Strategies"
          name="mitigationStrategies"
          value={data.mitigationStrategies}
          onChange={updateField}
          placeholder="Describe key strategies or plans to address going concern issues"
          rows={3}
        />
      </FormSection>

      <FormSection title="Supporting Documentation">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg border-dashed">
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <p className="text-xs text-blue-200 mb-2">
                Upload Supporting Evidence
              </p>
              <p className="text-xs text-blue-200 mb-3">
                Financial projections, loan agreements, board minutes, etc.
              </p>
              <Button variant="outline" size="sm">
                Select Files
              </Button>
            </div>
          </div>

          <TextareaField
            label="Additional Notes"
            name="additionalNotes"
            value={data.additionalNotes}
            onChange={updateField}
            placeholder="Any additional information relevant to the going concern assessment"
            rows={3}
          />
        </div>
      </FormSection>
    </div>
  );
}