import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sidebarSections } from "@/lib/config/sidebar-nav";
import { Users, Building, FileText, Briefcase, RocketIcon, BarChart3, Calendar, DollarSign, Receipt, CheckSquare, BookOpen, FolderOpen, LayoutTemplate, Link as LinkIcon, PanelTopInactiveIcon, Settings } from "lucide-react";
import DashboardEntityStats from '@/components/backyard/DashboardEntityStats'
import DashboardKPICards from '@/components/backyard/DashboardKPICards'
import type { KPI } from "@/components/backyard/DashboardKPICards";



// Placeholder counts (replace with Supabase queries)
const metrics = [
  { label: "Active Customers", count: 128, description: "Companies with ongoing engagement",  link: "/backyard/clients" },
  { label: "KWAY Retainers", count: 62, description: "Ongoing fractional support agreements",  link: "#" },
  { label: "KORP Retainers", count: 21, description: "Modular or ad hoc engagement types",  link: "#" },  
  { label: "Corporate Profiles", count: 434, description: "Incorporated entities on file",  link: "#" },
  { label: "Personal Profiles", count: 85, description: "Verified private individuals in CRM",  link: "#" },
  { label: "Visas", count: 55, description: "Active and historical visa records",  link: "#" },
  { label: "Trade Licensess", count: 23, description: "Valid business licenses across zones",  link: "#" },
  
]

const kpiStats: KPI[] = [
  { kpi_id: 1, name: 'Total Revenue (YTD)', stat: 'AED 1.2M', previousStat: 'AED 950K', change: '26%', changeType: 'increase' },
  { kpi_id: 2, name: 'Quotes Issued', stat: '312', previousStat: '280', change: '11%', changeType: 'increase' },
  { kpi_id: 3, name: 'Payroll Processed', stat: 'AED 3.4M', previousStat: 'AED 2.9M', change: '17%', changeType: 'increase' },
]



function groupRoadmap(sections) {
  const active = [];
  const comingSoon = [];
  sections.forEach(section => {
    section.items?.forEach(item => {
      if (!item.title) return;
      if (item.status === "active") active.push({ ...item, section: section.label });
      else comingSoon.push({ ...item, section: section.label });
    });
  });
  return { active, comingSoon };
}

export default function DashboardHome() {
  const { active, comingSoon } = groupRoadmap(sidebarSections);
  return (
    <div className="p-6 space-y-8">
     

      {/* KPI Performance Cards */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
        <DashboardKPICards stats={kpiStats} />
      </section>

      {/* Object Summary Cards */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Managed Records</h2>
        <DashboardEntityStats metrics={metrics} />
      </section>


 {/* Platform Overview */}
 <section className="bg-zinc-100 rounded-xl p-6 shadow flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-2 text-brand-charcoal">Kounted Platform Overview</h1>
          <p className="text-zinc-700 mb-4 max-w-2xl">
            Kounted's Backyard is our all-in-one compliance and client management interface. The platform is designed to:
          </p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-1">
            <li><b>Client Management</b>: Manage corporate entities and private individuals in a unified repository.</li>
            <li><b>Sales Quoting Tools</b>: Generate quotes and proposals with $KWAY CPQ and manage orders via KORP Kiosk.</li>
            <li><b>Payroll Suite</b>: Oversee employers, employees, payruns, payslips, and expenses with full compliance.</li>
            <li><b>Compliance Center</b>: Stay on top of KYC, SOPs, tax, and regulatory requirements.</li>
            <li><b>Admin & Settings</b>: Configure platform settings and access advanced admin tools.</li>
          </ul>
        </div>  
        <div>
          <h2 className="text-xl font-semibold mb-4">Platform Roadmap</h2> <div className="grid grid-cols-2 gap-6">
         <div>
            <h3 className="text-xs font-medium text-green-700 flex items-center px-2 gap-2 mb-2 border-b border-zinc-300 pb-2">✅ Active</h3>
            <ul className="space-y-2">
              {active.map(item => (
                <li key={item.title} className="text-xs flex items-center gap-2 rounded px-2 py-2">
                  <item.icon className="h-4 w-4 text-green-600" />
                  <span className="font-medium">{item.title}</span>
                  <span className="ml-auto"><span className="inline-block bg-green-100 text-green-700 text-xs rounded px-2 py-0.5">{item.section}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs  font-medium text-yellow-700 flex items-center px-2 gap-2 mb-2 border-b border-zinc-200 pb-2">🚧 Coming Soon</h3>
            <ul className="space-y-2">
              {comingSoon.map(item => (
                <li key={item.title} className="text-xs flex items-center gap-2 rounded px-3 py-2 opacity-80 italic">
                  <item.icon className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium">{item.title}</span>
                  <span className="ml-auto"><span className="inline-block bg-yellow-100 text-yellow-700 text-xs rounded px-2 py-0.5">{item.section}</span></span>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </div>    
      </section>
    </div>
  );
}
  