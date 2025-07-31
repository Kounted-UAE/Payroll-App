// app/backyard/layout.tsx
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppProviders } from '../providers'

  export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <SidebarProvider>
        <DashboardLayout >{children}</DashboardLayout>
      </SidebarProvider>
    </AppProviders>
  );
}