
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Plus,
  FileText,
  Building2,
  Users,
  Calculator,
  Receipt,
  Briefcase,
  FileCheck,
  Settings,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 'hr-visas',
    name: 'HR & Visas',
    description: 'Employee relations, visa processing, work permits',
    icon: Users,
    color: 'bg-blue-500',
    sopCount: 24
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Financial reporting, bookkeeping, auditing',
    icon: Calculator,
    color: 'bg-green-500',
    sopCount: 18
  },
  {
    id: 'payroll',
    name: 'Payroll',
    description: 'Salary processing, WPS, EOSB calculations',
    icon: Receipt,
    color: 'bg-purple-500',
    sopCount: 15
  },
  {
    id: 'taxation',
    name: 'Taxation',
    description: 'VAT, Corporate Tax, compliance reporting',
    icon: FileText,
    color: 'bg-red-500',
    sopCount: 32
  },
  {
    id: 'corporate-support',
    name: 'Corporate Support',
    description: 'Business setup, legal compliance, governance',
    icon: Briefcase,
    color: 'bg-orange-500',
    sopCount: 21
  },
  {
    id: 'company-formations',
    name: 'Company Formations',
    description: 'New company setup, licensing, registrations',
    icon: Building2,
    color: 'bg-cyan-500',
    sopCount: 28
  },
  {
    id: 'company-registrations',
    name: 'Company Registrations',
    description: 'Trade licenses, permits, regulatory filings',
    icon: FileCheck,
    color: 'bg-teal-500',
    sopCount: 19
  }
];

const recentSOPs = [
  {
    id: 'trade-license-renewal',
    title: 'Trade License Renewal',
    category: 'company-registrations',
    lastUpdated: '2 days ago',
    status: 'active'
  },
  {
    id: 'ubo-registration',
    title: 'Ultimate Beneficial Owner Registration',
    category: 'taxation',
    lastUpdated: '1 week ago',
    status: 'active'
  },
  {
    id: 'corporate-tax-registration',
    title: 'Corporate Tax Registration',
    category: 'taxation',
    lastUpdated: '3 days ago',
    status: 'active'
  },
  {
    id: 'employee-visa-renewal',
    title: 'Employee Visa Renewal Process',
    category: 'hr-visas',
    lastUpdated: '5 days ago',
    status: 'active'
  }
];

export default function SOPResourceCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/sop-resources/${categoryId}`);
  };

  const handleSOPClick = (categoryId: string, sopId: string) => {
    navigate(`/sop-resources/${categoryId}/${sopId}`);
  };

  const totalSOPs = categories.reduce((sum, category) => sum + category.sopCount, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SOP Resource Center</h1>
            <p className="text-muted-foreground">
              Comprehensive Standard Operating Procedures for Kounted's 7 Solution Groups
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/sop-resources/manage')}>
              <Plus className="mr-2 h-4 w-4" />
              Add SOP
            </Button>
            <Button variant="outline" onClick={() => navigate('/sop-resources/manage')}>
              <Settings className="mr-2 h-4 w-4" />
              Manage SOPs
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalSOPs}</p>
                  <p className="text-sm text-muted-foreground">Total SOPs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-sm text-muted-foreground">Solution Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Recent Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Most Popular</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SOPs across all categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Solution Groups Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Kounted Solution Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 ${category.color} rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{category.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {category.sopCount} SOPs
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Updated SOPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSOPs.map((sop) => {
                const category = categories.find(c => c.id === sop.category);
                return (
                  <div 
                    key={sop.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleSOPClick(sop.category, sop.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 ${category?.color} rounded`}>
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">{sop.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category?.name} • Updated {sop.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <Badge variant={sop.status === 'active' ? 'default' : 'secondary'}>
                      {sop.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
