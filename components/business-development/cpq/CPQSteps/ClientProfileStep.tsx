import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/react-ui/card';
import { Button } from '@/components/react-ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/react-ui/radio-group';
import { Label } from '@/components/react-ui/label';
import { Input } from '@/components/react-ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/react-ui/select';
import { Badge } from '@/components/react-ui/badge';
import { Separator } from '@/components/react-ui/separator';
import FormSection from '@/components/forms/FormSection';
import { TextField, SelectField } from '@/components/forms/FormField';
import { Building2, ChevronsUpDown, Check, Building, Calendar, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Function to create Supabase client
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration is missing. Please check your environment variables.')
  }

  return createClient(supabaseUrl, supabaseKey)
}

interface StepProps {
  data: any;
  allData?: any;
  onChange: (data: any) => void;
  onPricingChange?: (pricing: any) => void;
  pricing?: any;
  referenceId?: string;
}

interface Client {
  id: string;
  name: string;
  business_type?: string;
  contact_person?: string;
}

const ENTITY_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'sme', label: 'SME' },
  { value: 'spv', label: 'SPV' },
  { value: 'holdingco', label: 'Holding Company' },
  { value: 'offshore', label: 'Offshore' }
];

const LEGAL_STRUCTURES = [
  { value: 'sole_prop', label: 'Sole Proprietorship' },
  { value: 'llc', label: 'LLC' },
  { value: 'fzco', label: 'FZCO' },
  { value: 'branch', label: 'Branch' },
  { value: 'rep_office', label: 'Representative Office' }
];

const INTEGRATION_NEEDS = [
  { value: 'xero', label: 'Xero' },
  { value: 'quickbooks', label: 'QuickBooks' },
  { value: 'sap', label: 'SAP' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'teamwork', label: 'Teamwork' },
  { value: 'erp', label: 'Other ERP' },
  { value: 'none', label: 'No Integration Needed' }
];

export default function ClientProfileStep({ data, onChange }: StepProps) {
  const [isExistingClient, setIsExistingClient] = useState(data.isExistingClient || 'new');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [jurisdictions, setJurisdictions] = useState<any[]>([]);

  useEffect(() => {
    if (isExistingClient === 'existing') {
      loadClients();
    }
    
    if (data.selectedClientId && !selectedClient) {
      loadSelectedClient(data.selectedClientId);
    }
  }, [isExistingClient, data.selectedClientId]);

  // Fetch jurisdictions data
  useEffect(() => {
    const fetchJurisdictions = async () => {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from('kounted_uae_jurisdictions')
        .select('name')
        .order('name');

      if (!error && data) {
        setJurisdictions(data);
      }
    };

    fetchJurisdictions();
  }, []);

  const loadClients = async () => {
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, business_type, contact_person')
        .order('name');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const loadSelectedClient = async (clientId: string) => {
    try {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, business_type, contact_person')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      if (data) setSelectedClient(data);
    } catch (error) {
      console.error('Error loading selected client:', error);
    }
  };

  const updateField = (name: string, value: any) => {
    onChange({ ...data, [name]: value });
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.contact_person && client.contact_person.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setShowResults(false);
    onChange({
      ...data,
      selectedClientId: client.id,
      companyName: client.name,
      contactPerson: client.contact_person || ''
    });
  };

  return (
    <div className="space-y-6">
      <FormSection title="Client Type">
        <RadioGroup
          value={isExistingClient}
          onValueChange={(value) => {
            setIsExistingClient(value);
            updateField('isExistingClient', value);
          }}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existing" id="existing" />
            <Label htmlFor="existing">Existing Client</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new">New Client</Label>
          </div>
        </RadioGroup>
      </FormSection>

      {isExistingClient === 'existing' && (
        <FormSection title="Select Existing Client">
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search for a client..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(true);
                }}
                onClick={() => setShowResults(true)}
                className="w-full"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResults(!showResults)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <ChevronsUpDown className="h-4 w-4" />
              </Button>
              
              {showResults && filteredClients.length > 0 && (
                <Card className="absolute w-full mt-1 z-10">
                  <CardContent className="p-0 max-h-60 overflow-y-auto">
                    {filteredClients.map(client => (
                      <div
                        key={client.id}
                        className="p-2 hover:bg-accent cursor-pointer flex items-center gap-2"
                        onClick={() => handleSelectClient(client)}
                      >
                        <Building2 className="h-4 w-4 text-blue-200" />
                        <div>
                          <div className="font-medium">{client.name}</div>
                          {client.contact_person && (
                            <div className="text-xs text-blue-200">{client.contact_person}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
            
            {selectedClient && (
              <div className="bg-accent/20 p-3 rounded-md">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">{selectedClient.name}</div>
                    {selectedClient.contact_person && (
                      <div className="text-xs text-blue-200">{selectedClient.contact_person}</div>
                    )}
                  </div>
                  {selectedClient.business_type && (
                    <Badge variant="outline" className="ml-auto">
                      {selectedClient.business_type}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </FormSection>
      )}

      <FormSection title="Entity Information">
        {isExistingClient === 'new' && (
          <>
            <TextField
              label="Company Name"
              name="companyName"
              value={data.companyName || ''}
              onChange={updateField}
              required
            />
            
            <TextField
              label="Primary Contact Person"
              name="contactPerson"
              value={data.contactPerson || ''}
              onChange={updateField}
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Email"
                type="email"
                name="email"
                value={data.email || ''}
                onChange={updateField}
                required
              />
              
              <TextField
                label="Phone"
                type="tel"
                name="phone"
                value={data.phone || ''}
                onChange={updateField}
              />
            </div>
          </>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label="Entity Type"
            name="entityType"
            value={data.entityType || ''}
            onChange={updateField}
            options={ENTITY_TYPES}
            required
          />
          
          <SelectField
            label="Jurisdiction"
            name="jurisdiction"
            value={data.jurisdiction || ''}
            onChange={updateField}
            options={jurisdictions.map(j => ({ value: j.name, label: j.name }))}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Business Activity"
            name="businessActivity"
            value={data.businessActivity || ''}
            onChange={updateField}
            placeholder="e.g., Retail, Consulting, Manufacturing"
          />
          
          <SelectField
            label="Legal Structure"
            name="legalStructure"
            value={data.legalStructure || ''}
            onChange={updateField}
            options={LEGAL_STRUCTURES}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Years in Operation"
            name="yearsInOperation"
            value={data.yearsInOperation || ''}
            onChange={updateField}
            placeholder="e.g., 3"
          />
          
          <TextField
            label="Number of Employees"
            name="employeeCount"
            value={data.employeeCount || ''}
            onChange={updateField}
            placeholder="e.g., 10"
          />
        </div>
      </FormSection>

      <FormSection title="Integration Needs">
        <div className="space-y-3">
          <p className="text-xs text-blue-200">Select the systems you need to integrate with:</p>
          
          <div className="grid grid-cols-2 gap-2">
            {INTEGRATION_NEEDS.map(integration => (
              <div 
                key={integration.value}
                className={`p-3 border rounded-md cursor-pointer hover:bg-accent/50 flex items-center gap-2 ${
                  (data.integrationNeeds || []).includes(integration.value) 
                    ? 'border-blue-500 bg-blue-500/5' 
                    : 'border-border'
                }`}
                onClick={() => {
                  const current = data.integrationNeeds || [];
                  const updated = current.includes(integration.value)
                    ? current.filter((i: string) => i !== integration.value)
                    : [...current, integration.value];
                  updateField('integrationNeeds', updated);
                }}
              >
                {(data.integrationNeeds || []).includes(integration.value) && (
                  <Check className="h-4 w-4 text-blue-500" />
                )}
                <span>{integration.label}</span>
              </div>
            ))}
          </div>
        </div>
      </FormSection>
    </div>
  );
}