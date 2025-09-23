import React from 'react';
import ClientOnboardingWizard from '@/components/finance/accounting-onboarding/ClientOnboardingWizard';

interface ClientWizardProps {
  clientId: string;
  clientName?: string;
}

export default function ClientWizard({ clientId, clientName = 'Client' }: ClientWizardProps) {
  return (
    <ClientOnboardingWizard 
      clientId={clientId}
      clientName={clientName}
    />
  );
}