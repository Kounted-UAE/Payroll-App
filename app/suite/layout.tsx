// app/suite/layout.tsx
import DashboardLayout from "@/components/react-layout/DashboardLayout";
import { SidebarProvider } from '@/components/react-layout/sidebar-context'
import { AppProviders } from '../providers'


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <SidebarProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </SidebarProvider>
    </AppProviders>
  );
}