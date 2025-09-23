//components/dashboard-apps/ComplianceCalendar.tsx

'use client'

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/react-ui/card';
import { Button } from '@/components/react-ui/button';
import { Input } from '@/components/react-ui/input';
import { Badge } from '@/components/react-ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/react-ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/react-ui/table';
import { 
  Search, 
  Calendar,
  AlertTriangle,
  FileText,
  Building2,
  Users,
  DollarSign,
  ArrowUpDown,
  Filter
} from 'lucide-react';
import ComplianceItemModal from '@/components/react-layout/ComplianceItemModal';

interface ComplianceItem {
  id: string;
  dueDate: string;
  obligation: string;
  subjectMatter: string;
  authority: string;
  requirements: string;
  jurisdiction: string;
  entities: string;
  penalties: string;
  category: 'tax' | 'labor' | 'corporate' | 'regulatory' | 'licensing';
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  isObsolete?: boolean;
}

const complianceData: ComplianceItem[] = [
  {
    id: '1',
    dueDate: 'Within 60 days of company setup',
    obligation: 'Ultimate Beneficial Owner (UBO) Registration – Initial filing',
    subjectMatter: 'Anti-Money Laundering',
    authority: 'MoE / Cabinet Res. 58/2020',
    requirements: 'Create UBO register (owners >25% etc.) and file info with registrar (e.g. DED or free zone portal) – include shareholder & nominee director details. Provide IDs and ownership proofs.',
    jurisdiction: 'All UAE (Mainland & FZ)',
    entities: 'All companies (except wholly gov\'t-owned or listed)',
    penalties: 'Written warning, then fine up to AED 100,000 for continued non-compliance. License suspension or other sanctions possible.',
    category: 'regulatory',
    frequency: 'one-time'
  },
  {
    id: '2',
    dueDate: 'Within 30 days of crossing VAT threshold',
    obligation: 'VAT Registration Application',
    subjectMatter: 'Tax (VAT)',
    authority: 'FTA / VAT Law',
    requirements: 'Apply for VAT registration via FTA portal once taxable turnover > AED 375,000/year. Prepare sales records of last 12 months.',
    jurisdiction: 'All UAE (Mainland & FZ)',
    entities: 'Businesses with taxable turnover > AED 375k',
    penalties: 'AED 10,000 fixed penalty for late registration (reduced from 20k). Must also pay any due VAT retroactively.',
    category: 'tax',
    frequency: 'one-time'
  },
  {
    id: '3',
    dueDate: 'Within 20 business days of ceasing VAT eligibility',
    obligation: 'VAT De-registration Application',
    subjectMatter: 'Tax (VAT)',
    authority: 'FTA / VAT Law',
    requirements: 'If business stops taxable supplies or falls below threshold, file for VAT deregistration on FTA portal. Provide final tax return and any required documentation of cessation.',
    jurisdiction: 'All UAE (Mainland & FZ)',
    entities: 'VAT-registered businesses ceasing activities',
    penalties: 'AED 1,000 per month of delay (max AED 10k) for late deregistration. Continued failure can result in additional fines.',
    category: 'tax',
    frequency: 'one-time'
  },
  {
    id: '4',
    dueDate: 'Upon hiring – within 4 months',
    obligation: 'Unemployment Insurance Enrollment',
    subjectMatter: 'Labor (Social Security)',
    authority: 'MoHRE / Federal Decree-Law 13/2022',
    requirements: 'Employer must ensure new employees (except exempt categories) subscribe to the Involuntary Loss of Employment (ILOE) scheme within 4 months of joining. Can be done via ILOE portal or authorized channels.',
    jurisdiction: 'All UAE (Mainland & FZ private sector)',
    entities: 'All employees (except investors, domestic workers, <18, pensioned retirees)',
    penalties: 'AED 400 fine on the employee for failure to subscribe within deadline. Non-paid fines can block new work permits (employers are urged to facilitate compliance).',
    category: 'labor',
    frequency: 'one-time'
  },
  {
    id: '5',
    dueDate: '15th of each month',
    obligation: 'GPSSA Pension Contributions (previous month\'s payroll)',
    subjectMatter: 'Labor (Pensions)',
    authority: 'GPSSA / Fed. Law 7/1999',
    requirements: 'Calculate and remit social security contributions (20% of Emirati/GCC national salary; 5% employee + 15% employer) via GPSSA (Ma\'ashi) portal. Provide payroll invoice for each month.',
    jurisdiction: 'Mainland (and MOHRE-linked Free Zones)',
    entities: 'Employers of UAE or GCC nationals',
    penalties: 'Due by 1st–15th of month; late payment incurs 0.1% of unpaid contributions per day from the 16th (no prior notice). E.g. ~3% monthly interest on late payments.',
    category: 'labor',
    frequency: 'monthly'
  },
  {
    id: '6',
    dueDate: 'On employee payday (monthly); flagged at 17+ days delay',
    obligation: 'Wages Payment via WPS (Wage Protection System)',
    subjectMatter: 'Labor (Wages)',
    authority: 'MOHRE / Res. 598/2022',
    requirements: 'Pay all employees\' salaries through the WPS by the agreed payday (at least monthly). Maintain proof of salary transfer (salary information file via bank/exchange).',
    jurisdiction: 'Mainland (MOHRE firms); some FZ*',
    entities: 'All private-sector employers under MOHRE',
    penalties: 'If wage >15 days late, employer is marked non-compliant. After 17 days: MOHRE stops new work permits; large firms (>50 staff) added to inspection list. After 45 days: possible legal action for large firms. An administrative fine of AED 1,000 per unpaid worker (up to AED 20k) may be imposed. Repeat violators can be downgraded in MOHRE category (higher govt fees).',
    category: 'labor',
    frequency: 'monthly'
  },
  {
    id: '7',
    dueDate: '15th of each month',
    obligation: 'Excise Tax Return & Payment (for excise goods)',
    subjectMatter: 'Tax (Excise)',
    authority: 'FTA / Excise Tax Law',
    requirements: 'File excise tax return for the prior month\'s transactions (e.g. tobacco, energy drinks) through FTA e-Services. Pay due excise tax (50% or 100% on specified goods) by the 15th. Keep import/export records.',
    jurisdiction: 'All UAE (Mainland & FZ dealing in excise goods)',
    entities: 'Excise-registered importers, producers, stockpilers',
    penalties: 'AED 1,000 late filing penalty for first offense (AED 2,000 if repeated within 24 months). Late payment penalties: 2% of unpaid tax per day after due date (4% after 7 days) and 1% daily from one month late, up to 300% cap.',
    category: 'tax',
    frequency: 'monthly'
  },
  {
    id: '8',
    dueDate: '28th of each month (or next workday)',
    obligation: 'VAT Return Filing & Payment – Monthly cycle',
    subjectMatter: 'Tax (VAT)',
    authority: 'FTA / VAT Law',
    requirements: 'Submit VAT201 return via FTA portal for the monthly tax period (for large businesses >AED150m turnover). Declare output & input tax, and remit net VAT due by the 28th of the following month. Maintain sales and purchase invoices.',
    jurisdiction: 'All UAE (Mainland & FZ) – if monthly assigned',
    entities: 'VAT-registered businesses with monthly tax period (high turnover)',
    penalties: 'AED 1,000 late filing fine (first time), AED 2,000 if repeated within 24 months. Late payment: 2% immediately, 4% after 7 days, 1% daily after 1 month (capped at 300%).',
    category: 'tax',
    frequency: 'monthly'
  },
  {
    id: '9',
    dueDate: '28th of Jan, Apr, Jul, Oct* (or next workday)',
    obligation: 'VAT Return Filing & Payment – Quarterly cycle',
    subjectMatter: 'Tax (VAT)',
    authority: 'FTA / VAT Law',
    requirements: 'File quarterly VAT return for each quarter (e.g. Q1 Jan–Mar due by 28 April). Submit via FTA portal and pay any tax due. Ensure all taxable sales and expenses for the quarter are accounted for.',
    jurisdiction: 'All UAE (Mainland & FZ) – if quarterly assigned',
    entities: 'VAT-registered businesses with quarterly tax period',
    penalties: 'Same penalties as monthly VAT returns: AED 1,000 then 2,000 for late filing; escalating late payment fines (2%,4%,1%/day) on unpaid VAT.',
    category: 'tax',
    frequency: 'quarterly'
  },
  {
    id: '10',
    dueDate: '30 June 2025, 30 June 2026',
    obligation: 'Mid-Year Emiratisation Checkpoint (Semi-annual)',
    subjectMatter: 'Labor (Emiratisation)',
    authority: 'MOHRE / Nafis program',
    requirements: 'By 30 June – Companies with ≥50 employees should have achieved ~50% of the annual Emirati hiring target (1% out of 2%). Encourage hiring of UAE nationals and register them with MOHRE/GPSSA by this date.',
    jurisdiction: 'Mainland (MOHRE jurisdiction)',
    entities: 'Private companies ≥50 employees (skilled roles)',
    penalties: 'If mid-year target unmet, MOHRE may start imposing monthly fines from Q3. E.g. in 2024, firms short of H1 target faced AED 7k/month per missing hire from July (fines typically prorated of annual total). Timely compliance avoids accruing these penalties.',
    category: 'labor',
    frequency: 'semi-annual'
  },
  {
    id: '11',
    dueDate: '31 Dec 2025, 31 Dec 2026',
    obligation: 'Annual Emiratisation Target Deadline',
    subjectMatter: 'Labor (Emiratisation)',
    authority: 'MOHRE / Cabinet Res. 95/2022',
    requirements: 'By 31 December – Ensure 2% yearly increase in Emirati employees (skilled roles) over previous year\'s count. (e.g. If 4% was required by end-2024, then 6% by end-2025). Hire and register Emiratis via MOHRE + Nafis. SME (20–49 staff in select sectors) must employ at least 2 Emiratis by end-2025 (1 by end-2024).',
    jurisdiction: 'Mainland (MOHRE jurisdiction)',
    entities: 'Private companies ≥50 employees; and 20–49 in mandated sectors',
    penalties: 'Large companies (≥50): AED 96,000 per unmet Emirati for not achieving 2024 target (collected in 2025), rising to AED 108,000 in 2026 for 2025 shortfall (~AED 8k/9k per month per vacancy). SMEs (20–49 workers in key sectors): AED 96k if no Emirati by 2024, AED 108k if less than 2 by 2025. Fines start Jan of following year.',
    category: 'labor',
    frequency: 'annual'
  },
  {
    id: '12',
    dueDate: 'Annually – upon License anniversary',
    obligation: 'Trade License Renewal (incl. Chamber & permits)',
    subjectMatter: 'Commercial License',
    authority: 'DED / Free Zone Authorities',
    requirements: 'Renew business license before expiry (usually 1 year validity). Submit required docs: renewed lease (Ejari), last year\'s financial statements or audit (if required by authority), Ejari, insurance, etc. Pay renewal fees to DED or free zone.',
    jurisdiction: 'Mainland (each Emirate DED); All Free Zones (e.g. DMCC, DIFC, ADGM)',
    entities: 'All registered businesses (LLCs, branches, etc.)',
    penalties: 'Operating with an expired license is illegal. Penalties can include fines, trade license late renewal fees, and eventual license cancellation. E.g. Dubai imposes a late renewal penalty (often AED 250 per month after expiry, depending on jurisdiction). Businesses may be blacklisted for non-renewal.',
    category: 'licensing',
    frequency: 'annual'
  },
  {
    id: '13',
    dueDate: 'Annually – within 1 month of incorporation anniversary',
    obligation: 'Annual Confirmation Statement (ADGM) (formerly "annual return")',
    subjectMatter: 'Corporate Governance',
    authority: 'ADGM Registration Auth.',
    requirements: 'File an online Confirmation Statement to ADGM RA confirming company\'s details (business activities, directors, shareholders, registered office, etc.) up to date. Filing fee USD 100. This replaces an old annual return filing.',
    jurisdiction: 'ADGM (Abu Dhabi G.M.)',
    entities: 'ADGM companies and LLPs (not branches/Foundations)',
    penalties: 'Due within 1 month after each incorporation date anniversary. Late filing incurs automatic USD 300 fine (approx AED 1,100), non-waivable. Continued failure can lead to further regulatory action (e.g. license suspension).',
    category: 'corporate',
    frequency: 'annual'
  },
  {
    id: '14',
    dueDate: 'Annually – at time of license renewal',
    obligation: 'Annual Return / Confirmation (DIFC) (with license renewal)',
    subjectMatter: 'Corporate Governance',
    authority: 'DIFC Operating Law',
    requirements: 'Provide a confirmation of company details to the DIFC Registrar as part of the annual commercial license renewal process (the annual return requirement was replaced by this Confirmation Statement at renewal). Ensure any changes in directors, shareholders, etc. are updated via DIFC portal before renewal.',
    jurisdiction: 'DIFC (Dubai IFC)',
    entities: 'DIFC companies (Ltd, LLC, etc.)',
    penalties: 'If the license is not renewed (and confirmation not filed), the company will be in default. DIFC may impose late renewal fees or ultimately strike off the entity. (Specific confirmation statement fines are not separate in DIFC; it\'s tied to license status.)',
    category: 'corporate',
    frequency: 'annual'
  },
  {
    id: '15',
    dueDate: 'Within 9 months after FY end (6 months if Public Co.)',
    obligation: 'Annual Financial Accounts Filing (ADGM)',
    subjectMatter: 'Financial Reporting',
    authority: 'ADGM Companies Regs.',
    requirements: 'Directors must prepare annual financial statements (audited if required) and submit accounts to ADGM Registrar within 9 months of financial year-end for private companies (within 6 months for public companies). Small ADGM companies may file a simplified balance sheet. Accounts are filed online to the RA.',
    jurisdiction: 'ADGM',
    entities: 'ADGM incorporated entities (except branches/Foundations)',
    penalties: 'Late filing of accounts triggers automatic fines. ADGM imposes strict liability penalties for each day overdue. Fines can range up to USD 15,000 (Level 5 penalty) for severely late accounts. Example: initial fine ~$1,500 for ≤1 month late, escalating to max $15k beyond 6 months late (per ADGM guidance). Continual non-compliance may lead to license revocation.',
    category: 'corporate',
    frequency: 'annual'
  },
  {
    id: '16',
    dueDate: 'Within 180 days after FY end',
    obligation: 'Audited Financial Statements Submission (DMCC)',
    subjectMatter: 'Financial Reporting',
    authority: 'DMCC Company Regs.',
    requirements: 'Upload the signed Audited Financial Statements and a Summary Sheet via the DMCC member portal within 180 days of each financial year-end. Auditor must be a DMCC-approved auditor. Companies should retain original audit reports and produce to DMCC if requested.',
    jurisdiction: 'DMCC Free Zone (Dubai)',
    entities: 'All DMCC-registered companies (incl. subsidiaries and branches)',
    penalties: 'Failure to submit by deadline may result in free zone penalties. DMCC can block license renewal until compliance. While DMCC charges no direct fee for filing, non-compliance can incur fines or sanctions as per DMCC rules (e.g. potential late submission fine or warning). Persistent failure can lead to license suspension.',
    category: 'corporate',
    frequency: 'annual'
  },
  {
    id: '17',
    dueDate: '(OBSOLETE after 2022) historically: 30 June (notification) 31 Dec (report)',
    obligation: 'Economic Substance Regulation (ESR) Filings',
    subjectMatter: 'Regulatory (OECD compliance)',
    authority: 'MoF / Cabinet Res. 31/2019',
    requirements: 'No longer required from 2023 onward. (Previously, UAE companies conducting relevant activities had to file an ESR Notification within 6 months of FY end, and an ESR Report within 12 months. Relevant "Licensees" had to demonstrate adequate economic substance in the UAE.) Supporting docs included financial statements and activity analysis.',
    jurisdiction: 'All UAE (Mainland & FZ) – if relevant activity',
    entities: '(Was applicable to banking, insurance, finance/leasing, HQ, shipping, holding co, IP, distribution/service centers)',
    penalties: 'Requirement eliminated for periods ending after 31 Dec 2022. (For reference: non-compliance previously drew fines of AED 10k–50k for first-year failure, AED 50k–300k for repeats, and risk of license revocation).',
    category: 'regulatory',
    frequency: 'annual',
    isObsolete: true
  },
  {
    id: '18',
    dueDate: 'Annually – by license renewal',
    obligation: 'Data Protection Renewal (ADGM)',
    subjectMatter: 'Data Privacy',
    authority: 'ADGM DPR 2021',
    requirements: 'All ADGM entities must renew their Data Protection registration each year. Confirm no changes in processing of personal data and pay the annual renewal fee (USD 300) via the ADGM online portal. This renewal affirms compliance with ADGM Data Protection Regulations.',
    jurisdiction: 'ADGM',
    entities: 'All ADGM registered entities (data controllers)',
    penalties: 'Late renewal fine: USD 750 (approx AED 2,750) if fee not paid by due date. Continued failure could result in administrative sanctions by the Office of Data Protection, including possible penalties per breach of DP regulations.',
    category: 'regulatory',
    frequency: 'annual'
  },
  {
    id: '19',
    dueDate: 'Annually – by license renewal',
    obligation: 'Data Protection Notification Renewal (DIFC)**',
    subjectMatter: 'Data Privacy',
    authority: 'DIFC DP Law 2020',
    requirements: 'DIFC entities must maintain a current Data Protection notification. Annual renewal is required (notification valid 1 year), typically coinciding with license renewal. Pay the applicable renewal fee (USD 100, 250, or 500 depending on entity category). Update any changes in processing activities to the Commissioner of Data Protection.',
    jurisdiction: 'DIFC',
    entities: 'DIFC companies, LLPs, etc. (handling personal data)',
    penalties: 'Failure to renew the DP notification can lead to non-compliance with DIFC DP Law. The Commissioner may impose fines for operating without a valid notification (DIFC fines can reach up to USD 50,000 for data protection breaches). It may also hold up the license renewal until resolved.',
    category: 'regulatory',
    frequency: 'annual'
  },
  {
    id: '20',
    dueDate: '9 months after FY end (typical)',
    obligation: 'Corporate Tax Return Filing & Payment',
    subjectMatter: 'Tax (Corporate Income)',
    authority: 'FTA / Min. of Finance',
    requirements: 'Prepare and file the UAE Corporate Tax Return (financial statements and schedules) for the Tax Period. Due within 9 months after the end of the financial year (e.g. FY ending 31 Dec 2024 → return due by 30 Sep 2025). Payment of the 9% corporate tax is due by the same deadline. Free zone companies claim 0% on qualifying income in the return if eligible.',
    jurisdiction: 'All UAE (Mainland & FZ)',
    entities: 'All Taxable Persons (companies and branches; exemptions still must file declaration)',
    penalties: 'Late filing/payment penalties: AED 500 per month (first 12 months) then AED 1,000 per month thereafter. Metered from the day after due date. For example, a one-month delay = AED 500 fine; 13-month delay = AED 6,000 total. Late payment also accrues 1% monthly interest on tax due. Non-compliance beyond 12+ months can trigger higher fines and legal measures. (Note: FTA Decision 7/2024 extended first-year deadlines for tax periods ended Dec 2023–Feb 2024 to 31 Dec 2024.)',
    category: 'tax',
    frequency: 'annual'
  }
];

export default function ComplianceCalendar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState<keyof ComplianceItem>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { id: 'all', label: 'All Compliance', icon: FileText, count: complianceData.length },
    { id: 'tax', label: 'Tax', icon: DollarSign, count: complianceData.filter(item => item.category === 'tax').length },
    { id: 'labor', label: 'Labor & HR', icon: Users, count: complianceData.filter(item => item.category === 'labor').length },
    { id: 'corporate', label: 'Corporate', icon: Building2, count: complianceData.filter(item => item.category === 'corporate').length },
    { id: 'licensing', label: 'Licensing', icon: FileText, count: complianceData.filter(item => item.category === 'licensing').length },
    { id: 'regulatory', label: 'Regulatory', icon: AlertTriangle, count: complianceData.filter(item => item.category === 'regulatory').length }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tax':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'labor':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'corporate':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'licensing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'regulatory':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-zinc-100 text-zinc-400 border-border';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'one-time':
        return 'bg-zinc-100 text-zinc-400';
      case 'monthly':
        return 'bg-primary/10 text-primary';
      case 'quarterly':
        return 'bg-primary/10 text-primary';
      case 'semi-annual':
        return 'bg-primary/10 text-primary';
      case 'annual':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-zinc-100 text-zinc-400';
    }
  };

  const filteredData = useMemo(() => {
    let filtered = complianceData.filter(item => {
      const matchesSearch = 
        item.obligation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subjectMatter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jurisdiction.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeTab === 'all' || item.category === activeTab;
      
      return matchesSearch && matchesCategory;
    });

    // Sort the data
    filtered.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [searchTerm, activeTab, sortField, sortDirection]);

  const handleSort = (field: keyof ComplianceItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleItemClick = (item: ComplianceItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-lg text-zinc-600 font-bold">UAE Compliance Calendar</h1>
            <p className="text-zinc-400">Comprehensive compliance obligations for UAE businesses (2025-2026)</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">Updated for 2025-2026</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-xs font-medium text-zinc-400">Total Obligations</p>
                  <p className="text-xs font-bold">{complianceData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <p className="text-xs font-medium text-zinc-400">Tax Related</p>
                  <p className="text-xs font-bold">{complianceData.filter(item => item.category === 'tax').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-primary mr-3" />
                <div>
                  <p className="text-xs font-medium text-zinc-400">Labor & HR</p>
                  <p className="text-xs font-bold">{complianceData.filter(item => item.category === 'labor').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-amber-600 mr-3" />
                <div>
                  <p className="text-xs font-medium text-zinc-400">Regulatory</p>
                  <p className="text-xs font-bold">{complianceData.filter(item => item.category === 'regulatory').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input
              placeholder="Search compliance obligations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Filter className="h-4 w-4" />
            <span>{filteredData.length} of {complianceData.length} obligations</span>
          </div>
        </div>

        {/* Tabs for Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                  <Badge variant="secondary" className="ml-1">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Compliance Obligations
                  {activeTab !== 'all' && (
                    <Badge className={getCategoryColor(activeTab)}>
                      {categories.find(c => c.id === activeTab)?.label}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('dueDate')}
                            className="h-auto p-0 font-semibold"
                          >
                            Due Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead className="min-w-[250px]">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort('obligation')}
                            className="h-auto p-0 font-semibold"
                          >
                            Obligation
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead className="min-w-[200px]">Authority</TableHead>
                        <TableHead className="min-w-[200px]">Jurisdiction</TableHead>
                        <TableHead className="min-w-[200px]">Applicable Entities</TableHead>
                        <TableHead className="min-w-[300px]">Penalties</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id} className={item.isObsolete ? 'opacity-50' : ''}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {item.isObsolete && (
                                <Badge variant="destructive" className="text-xs">
                                  OBSOLETE
                                </Badge>
                              )}
                              <button
                                onClick={() => handleItemClick(item)}
                                className={`text-left hover:text-primary transition-colors ${item.isObsolete ? 'line-through' : ''}`}
                              >
                                {item.dueDate}
                              </button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <button
                                onClick={() => handleItemClick(item)}
                                className="text-left hover:text-primary transition-colors"
                              >
                                <p className="font-medium">{item.obligation}</p>
                              </button>
                              <p className="text-xs text-zinc-400">{item.subjectMatter}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getCategoryColor(item.category)}>
                              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getFrequencyColor(item.frequency)}>
                              {item.frequency.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">{item.authority}</TableCell>
                          <TableCell className="text-xs">{item.jurisdiction}</TableCell>
                          <TableCell className="text-xs">{item.entities}</TableCell>
                          <TableCell className="text-xs">
                            <div className="max-w-xs">
                              <p className="text-xs leading-relaxed">{item.penalties}</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredData.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
                    <p className="text-zinc-400">
                      No compliance obligations found matching your criteria.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xs">Legend & Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-semibold mb-2">Abbreviations</h4>
                <ul className="space-y-1 text-zinc-400">
                  <li><strong>MoE:</strong> Ministry of Economy</li>
                  <li><strong>FTA:</strong> Federal Tax Authority</li>
                  <li><strong>MOHRE:</strong> Ministry of Human Resources & Emiratisation</li>
                  <li><strong>GPSSA:</strong> UAE General Pension & Social Security Authority</li>
                  <li><strong>DED:</strong> Department of Economic Development</li>
                  <li><strong>FZ:</strong> Free Zone</li>
                  <li><strong>ADGM:</strong> Abu Dhabi Global Market</li>
                  <li><strong>DIFC:</strong> Dubai International Financial Centre</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Important Notes</h4>
                <ul className="space-y-1 text-zinc-400">
                  <li>• All penalties are subject to change based on updated regulations</li>
                  <li>• Some free zones may have different requirements</li>
                  <li>• Consult with legal/tax advisors for specific situations</li>
                  <li>• This calendar is for reference only and should not replace professional advice</li>
                  <li>• Obsolete obligations are shown for historical reference</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <ComplianceItemModal
          item={selectedItem}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}