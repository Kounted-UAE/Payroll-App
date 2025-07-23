'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Building2, 
  Calendar, 
  Users, 
  Phone, 
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';
import ClientOnboardingWizard from '@/components/wizards/accounting-onboarding/ClientOnboardingWizard';
import { ActionButtons } from '@/components/ui/action-buttons';
import ClientActionsDialog from '@/components/wizards/client-management/ClientActionsDialog';

interface Client {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone?: string;
  business_type: string;
  status: string;
  created_at: string;
  last_activity_date?: string;
}

interface OnboardingProfile {
  id: string;
  client_id: string;
  status: string;
  last_updated_at: string;
}

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [onboardingProfiles, setOnboardingProfiles] = useState<OnboardingProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [dialogMode, setDialogMode] = useState<'edit' | 'duplicate' | null>(null);
  
  // New client form state
  const [newClient, setNewClient] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    business_type: '',
    status: 'active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load clients and onboarding profiles in parallel
      const [clientsResult, profilesResult] = await Promise.all([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('client_operational_profiles').select('id, client_id, status, last_updated_at')
      ]);

      if (clientsResult.error) throw clientsResult.error;
      if (profilesResult.error) throw profilesResult.error;

      setClients(clientsResult.data || []);
      setOnboardingProfiles(profilesResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load clients data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewClient = async () => {
    try {
      if (!newClient.name || !newClient.contact_person || !newClient.email) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        });
        return;
      }

      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select()
        .single();

      if (error) throw error;

      setClients(prev => [data, ...prev]);
      setShowNewClientDialog(false);
      setNewClient({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        business_type: '',
        status: 'active'
      });

      // Automatically start onboarding for new client
      setSelectedClient(data);
      setShowWizard(true);

      toast({
        title: 'Success',
        description: 'New client created successfully'
      });
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new client',
        variant: 'destructive'
      });
    }
  };

  const getOnboardingStatus = (clientId: string) => {
    const profile = onboardingProfiles.find(p => p.client_id === clientId);
    if (!profile) return { status: 'not-started', color: 'secondary', icon: Clock };
    
    switch (profile.status) {
      case 'complete':
        return { status: 'Complete', color: 'default', icon: CheckCircle2 };
      case 'draft':
        return { status: 'In Progress', color: 'secondary', icon: AlertCircle };
      default:
        return { status: 'Not Started', color: 'secondary', icon: Clock };
    }
  };

  const startOnboarding = (client: Client) => {
    setSelectedClient(client);
    setShowWizard(true);
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== clientId));
      toast({
        title: 'Success',
        description: 'Client deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete client',
        variant: 'destructive'
      });
    }
  };

  const handleSendClientEmail = async (client: Client) => {
    try {
      const { error } = await supabase.functions.invoke('send-client-email', {
        body: { clientId: client.id }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Email sent successfully'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send email. Please check if Resend is configured.',
        variant: 'destructive'
      });
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showWizard && selectedClient) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 border-b bg-card">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowWizard(false);
              setSelectedClient(null);
              loadData(); // Refresh data when returning
            }}
            className="mb-4"
          >
            ← Back to Client Management
          </Button>
        </div>
        <ClientOnboardingWizard 
          clientId={selectedClient.id}
          clientName={selectedClient.name}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
            <p className="text-muted-foreground">Manage clients and their onboarding progress</p>
          </div>
          
          <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Company Name *</Label>
                    <Input
                      id="name"
                      value={newClient.name}
                      onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="ABC Company Ltd"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_person">Contact Person *</Label>
                    <Input
                      id="contact_person"
                      value={newClient.contact_person}
                      onChange={(e) => setNewClient(prev => ({ ...prev, contact_person: e.target.value }))}
                      placeholder="John Smith"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@abccompany.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newClient.phone}
                      onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="business_type">Business Type</Label>
                  <Select
                    value={newClient.business_type}
                    onValueChange={(value) => setNewClient(prev => ({ ...prev, business_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Real Estate">Real Estate</SelectItem>
                      <SelectItem value="Construction">Construction</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Hospitality">Hospitality</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setShowNewClientDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createNewClient}>
                    Create & Start Onboarding
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Total Clients</p>
                  <p className="text-2xl font-bold">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium">Onboarded</p>
                  <p className="text-2xl font-bold">
                    {onboardingProfiles.filter(p => p.status === 'complete').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clients List */}
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading clients...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'No clients found matching your search.' : 'No clients yet. Create your first client to get started.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClients.map((client) => {
                  const onboardingStatus = getOnboardingStatus(client.id);
                  const StatusIcon = onboardingStatus.icon;
                  
                  return (
                    <div key={client.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            <h3 className="font-semibold text-lg">{client.name}</h3>
                            <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                              {client.status}
                            </Badge>
                            <Badge variant={onboardingStatus.color as any} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {onboardingStatus.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              {client.contact_person}
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {client.email}
                            </div>
                            {client.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {client.phone}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(client.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          
                          {client.business_type && (
                            <div className="mt-2">
                              <Badge variant="outline">{client.business_type}</Badge>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startOnboarding(client)}
                            className="gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            {onboardingStatus.status === 'Complete' ? 'View Profile' : 'Start Onboarding'}
                          </Button>
                          
                          <ActionButtons
                            onEdit={() => {
                              setEditingClient(client);
                              setDialogMode('edit');
                            }}
                            onDuplicate={() => {
                              setEditingClient(client);
                              setDialogMode('duplicate');
                            }}
                            onDelete={() => handleDeleteClient(client.id)}
                            onSend={() => handleSendClientEmail(client)}
                            deleteTitle="Delete Client"
                            deleteDescription="Are you sure you want to delete this client? This will also remove all associated data."
                            sendLabel="Send Welcome Email"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
          </Card>
        </div>

        <ClientActionsDialog
          client={editingClient}
          isOpen={!!editingClient && !!dialogMode}
          onClose={() => {
            setEditingClient(null);
            setDialogMode(null);
          }}
          onUpdate={loadData}
          mode={dialogMode}
        />
      </div>
    );
  }