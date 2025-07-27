// app/backyard/layout.tsx
import DashboardLayout from "@/components/dashboard-layout/DashboardLayout";
import { SidebarProvider } from '@/components/ui/sidebar'


  export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>      
      <SidebarProvider>
        <DashboardLayout >{children}</DashboardLayout>
      </SidebarProvider>
    </>
  );
}