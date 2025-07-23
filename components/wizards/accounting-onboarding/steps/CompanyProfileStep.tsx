import React from 'react';
import FormSection from '../FormSection';
import { TextField, SelectField, TextareaField } from '../FormField';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface StepProps {
  data: any;
  onChange: (data: any) => void;
}

export default function CompanyProfileStep({ data, onChange }: StepProps) {
  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  const addOwner = () => {
    const owners = data.owners || [];
    onChange({ 
      ...data, 
      owners: [...owners, { name: '', percentage: '', nationality: '' }] 
    });
  };

  const updateOwner = (index: number, field: string, value: any) => {
    const owners = [...(data.owners || [])];
    owners[index] = { ...owners[index], [field]: value };
    onChange({ ...data, owners });
  };

  const removeOwner = (index: number) => {
    const owners = [...(data.owners || [])];
    owners.splice(index, 1);
    onChange({ ...data, owners });
  };

  return (
    <div className="space-y-6">
      <FormSection title="Basic Information">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Legal Name"
            name="legalName"
            value={data.legalName}
            onChange={updateField}
            required
          />
          <TextField
            label="Trading Name"
            name="tradingName"
            value={data.tradingName}
            onChange={updateField}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="License Type"
            name="licenseType"
            value={data.licenseType}
            onChange={updateField}
            options={['Mainland', 'Freezone', 'Offshore']}
            required
          />
          <TextField
            label="Date of Incorporation"
            name="dateOfIncorporation"
            type="date"
            value={data.dateOfIncorporation}
            onChange={updateField}
            required
          />
        </div>

        <TextField
          label="Registration Number"
          name="registrationNumber"
          value={data.registrationNumber}
          onChange={updateField}
          required
        />
      </FormSection>

      <FormSection title="Contact Information">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Website"
            name="website"
            type="url"
            value={data.website}
            onChange={updateField}
            placeholder="https://"
          />
          <TextField
            label="Main Phone"
            name="phone"
            type="tel"
            value={data.phone}
            onChange={updateField}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={data.email}
            onChange={updateField}
            required
          />
          <TextField
            label="Contact Person"
            name="contactPerson"
            value={data.contactPerson}
            onChange={updateField}
            required
          />
        </div>

        <TextareaField
          label="Registered Address"
          name="registeredAddress"
          value={data.registeredAddress}
          onChange={updateField}
          required
        />
      </FormSection>

      <FormSection title="Ownership Structure">
        <div className="space-y-4">
          {(data.owners || []).map((owner: any, index: number) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Owner {index + 1}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeOwner(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <TextField
                  label="Name"
                  name={`owner-${index}-name`}
                  value={owner.name}
                  onChange={(_, value) => updateOwner(index, 'name', value)}
                  required
                />
                <TextField
                  label="Percentage"
                  name={`owner-${index}-percentage`}
                  value={owner.percentage}
                  onChange={(_, value) => updateOwner(index, 'percentage', value)}
                  placeholder="25%"
                  required
                />
                <TextField
                  label="Nationality"
                  name={`owner-${index}-nationality`}
                  value={owner.nationality}
                  onChange={(_, value) => updateOwner(index, 'nationality', value)}
                />
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={addOwner}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Owner
          </Button>
        </div>
      </FormSection>
    </div>
  );
}