// app/advontier/layout.tsx
import DashboardLayout from "@/components/advontier-layout/DashboardLayout";
import { SidebarProvider } from '@/components/advontier-layout/sidebar-context'
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