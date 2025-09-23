import React, { useState } from 'react';
import FormSection from '@/components/forms/FormSection';
import { TextField } from '@/components/forms/FormField';
import { Button } from '@/components/react-ui/button';
import { Calendar, Clock, User } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/react-ui/radio-group';
import { Label } from '@/components/react-ui/label';

interface StepProps {
  data: any;
  allData?: any;
  onChange: (data: any) => void;
  onPricingChange?: (pricing: any) => void;
  pricing?: any;
  referenceId?: string;
}

export default function LeadCaptureStep({ data, allData, onChange, referenceId }: StepProps) {
  const [submitting, setSubmitting] = useState(false);

  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  // If we already have contact details from earlier, use those
  const defaultName = allData?.step1?.contactPerson || '';
  const defaultEmail = allData?.step1?.email || '';
  const defaultPhone = allData?.step1?.phone || '';

  return (
    <div className="space-y-6">
      <FormSection title="Contact Information">
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Full Name"
            name="fullName"
            value={data.fullName || defaultName}
            onChange={updateField}
            required
          />
          
          <TextField
            label="Job Title"
            name="jobTitle"
            value={data.jobTitle || ''}
            onChange={updateField}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={data.email || defaultEmail}
            onChange={updateField}
            required
          />
          
          <TextField
            label="Phone Number"
            name="phone"
            type="tel"
            value={data.phone || defaultPhone}
            onChange={updateField}
            required
          />
        </div>
        
        <TextField
          label="Any additional information or special requirements"
          name="additionalInfo"
          value={data.additionalInfo || ''}
          onChange={updateField}
          placeholder="Any specific questions or requirements we should know about"
        />
      </FormSection>

      <FormSection title="Preferred Contact Method">
        <RadioGroup
          value={data.preferredContact || 'email'}
          onValueChange={(value) => updateField('preferredContact', value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="r1" />
            <Label htmlFor="r1">Email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="r2" />
            <Label htmlFor="r2">Phone</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="whatsapp" id="r3" />
            <Label htmlFor="r3">WhatsApp</Label>
          </div>
        </RadioGroup>
      </FormSection>

      <FormSection title="Preferred Contact Time">
        <RadioGroup
          value={data.preferredTime || 'business_hours'}
          onValueChange={(value) => updateField('preferredTime', value)}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="business_hours" id="t1" />
            <Label htmlFor="t1">Business Hours (9am - 5pm)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="morning" id="t2" />
            <Label htmlFor="t2">Morning (9am - 12pm)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="afternoon" id="t3" />
            <Label htmlFor="t3">Afternoon (12pm - 5pm)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="evening" id="t4" />
            <Label htmlFor="t4">Evening (After 5pm)</Label>
          </div>
        </RadioGroup>
      </FormSection>

      <FormSection title="Next Steps">
        <div className="space-y-4">
          <p className="text-xs text-blue-200">
            Thank you for completing the service request wizard. Your reference ID is <span className="font-semibold">{referenceId}</span>. 
            Please select your preferred next step:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 px-6 flex flex-col items-center text-center border-2 hover:bg-accent"
              onClick={() => updateField('preferredAction', 'proposal')}
              disabled={submitting}
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="font-medium mb-1">Request Detailed Proposal</span>
              <span className="text-xs text-blue-200">Receive a customized proposal by email</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 px-6 flex flex-col items-center text-center border-2 hover:bg-accent"
              onClick={() => updateField('preferredAction', 'meeting')}
              disabled={submitting}
            >
              <Clock className="h-6 w-6 mb-2" />
              <span className="font-medium mb-1">Book a Meeting</span>
              <span className="text-xs text-blue-200">Schedule a consultation with our team</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 px-6 flex flex-col items-center text-center border-2 hover:bg-accent"
              onClick={() => updateField('preferredAction', 'contract')}
              disabled={submitting}
            >
              <User className="h-6 w-6 mb-2" />
              <span className="font-medium mb-1">Accept & Proceed</span>
              <span className="text-xs text-blue-200">Move directly to contract signing</span>
            </Button>
          </div>
        </div>
      </FormSection>
    </div>
  );
}