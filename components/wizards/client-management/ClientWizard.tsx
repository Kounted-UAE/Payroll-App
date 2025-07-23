import React from 'react';
import ClientOnboardingWizard from '@/components/wizards/ClientOnboardingWizard';

export default function ClientWizard() {
  return (
    <ClientOnboardingWizard 
      clientId="demo-client-123"
      clientName="Demo Company Ltd"
    />
  );
}