import React from 'react';

export default function ClientWizardPage({ params }: { params: { clientId: string } }) {
  return <div className="p-8">Client Wizard for clientId: {params.clientId} (placeholder)</div>;
} 