import React from 'react';
import FormSection from '@/components/forms/FormSection';
import { TextField, TextareaField } from '@/components/forms/FormField';
import { Button } from '@/components/react-ui/button';
import { Plus, X, Upload } from 'lucide-react';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

export default function ManagementGovernanceStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  const addPerson = (type: 'directors' | 'management' | 'advisors' | 'signatories') => {
    const current = data[type] || [];
    onChange({ 
      ...data, 
      [type]: [...current, { name: '', position: '', email: '', phone: '' }] 
    });
  };

  const updatePerson = (type: 'directors' | 'management' | 'advisors' | 'signatories', index: number, field: string, value: any) => {
    const current = [...(data[type] || [])];
    current[index] = { ...current[index], [field]: value };
    onChange({ ...data, [type]: current });
  };

  const removePerson = (type: 'directors' | 'management' | 'advisors' | 'signatories', index: number) => {
    const current = [...(data[type] || [])];
    current.splice(index, 1);
    onChange({ ...data, [type]: current });
  };

  const PersonSection = ({ 
    title, 
    type, 
    description 
  }: { 
    title: string; 
    type: 'directors' | 'management' | 'advisors' | 'signatories';
    description?: string;
  }) => (
    <FormSection title={title} description={description}>
      <div className="space-y-4">
        {(data[type] || []).map((person: any, index: number) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{title.slice(0, -1)} {index + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removePerson(type, index)}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Full Name"
                name={`${type}-${index}-name`}
                value={person.name}
                onChange={(_, value) => updatePerson(type, index, 'name', value)}
                required
              />
              <TextField
                label="Position/Title"
                name={`${type}-${index}-position`}
                value={person.position}
                onChange={(_, value) => updatePerson(type, index, 'position', value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Email"
                name={`${type}-${index}-email`}
                type="email"
                value={person.email}
                onChange={(_, value) => updatePerson(type, index, 'email', value)}
              />
              <TextField
                label="Phone"
                name={`${type}-${index}-phone`}
                type="tel"
                value={person.phone}
                onChange={(_, value) => updatePerson(type, index, 'phone', value)}
              />
            </div>

            {type === 'signatories' && (
              <TextField
                label="Signing Authority Limit (AED)"
                name={`${type}-${index}-limit`}
                value={person.limit}
                onChange={(_, value) => updatePerson(type, index, 'limit', value)}
                placeholder="10000"
              />
            )}
          </div>
        ))}
        
        <Button
          variant="outline"
          onClick={() => addPerson(type)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {title.slice(0, -1)}
        </Button>
      </div>
    </FormSection>
  );

  return (
    <div className="space-y-6">
      <PersonSection 
        title="Directors" 
        type="directors"
        description="Board of Directors and their details"
      />

      <PersonSection 
        title="Management Team" 
        type="management"
        description="Senior management and key personnel"
      />

      <PersonSection 
        title="External Advisors" 
        type="advisors"
        description="External consultants, advisors, and service providers"
      />

      <PersonSection 
        title="Authorized Signatories" 
        type="signatories"
        description="Individuals authorized to sign on behalf of the company"
      />

      <FormSection title="Organizational Documentation">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg border-dashed">
            <div className="text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-zinc-400" />
              <p className="text-xs text-zinc-400 mb-2">
                Upload Organizational Chart
              </p>
              <Button variant="outline" size="sm">
                Select File
              </Button>
            </div>
          </div>

          <TextareaField
            label="Governance Structure Notes"
            name="governanceNotes"
            value={data.governanceNotes}
            onChange={updateField}
            placeholder="Any additional notes about the organizational structure and governance"
            rows={3}
          />
        </div>
      </FormSection>
    </div>
  );
}