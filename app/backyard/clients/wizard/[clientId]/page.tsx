// app/clients/wizard/[clientId]/page.tsx

"use client";

import { useParams } from "next/navigation";
import ClientWizard from "@/components/wizards/client-management/ClientWizard";

export default function ClientWizardPage() {
  const { clientId } = useParams();
  return <ClientWizard clientId={clientId as string} />;
}
