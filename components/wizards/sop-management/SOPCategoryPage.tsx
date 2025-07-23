
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Search,
  Plus,
  FileText,
  Clock,
  Eye,
  Edit,
  Copy,
  Download,
  Filter
} from 'lucide-react';

const categoryData = {
  'hr-visas': {
    name: 'HR & Visas',
    description: 'Employee relations, visa processing, work permits',
    color: 'bg-blue-500'
  },
  'accounting': {
    name: 'Accounting',
    description: 'Financial reporting, bookkeeping, auditing',
    color: 'bg-green-500'
  },
  'payroll': {
    name: 'Payroll',
    description: 'Salary processing, WPS, EOSB calculations',
    color: 'bg-purple-500'
  },
  'taxation': {
    name: 'Taxation',
    description: 'VAT, Corporate Tax, compliance reporting',
    color: 'bg-red-500'
  },
  'corporate-support': {
    name: 'Corporate Support',
    description: 'Business setup, legal compliance, governance',
    color: 'bg-orange-500'
  },
  'company-formations': {
    name: 'Company Formations',
    description: 'New company setup, licensing, registrations',
    color: 'bg-cyan-500'
  },
  'company-registrations': {
    name: 'Company Registrations',
    description: 'Trade licenses, permits, regulatory filings',
    color: 'bg-teal-500'
  }
};

const sampleSOPs = [
  {
    id: 'corporate-tax-registration',
    title: 'Corporate Tax Registration',
    description: 'Complete guide for registering companies for Corporate Tax with FTA',
    status: 'active',
    lastUpdated: '3 days ago',
    templateCount: 3,
    viewCount: 145
  },
  {
    id: 'trade-license-renewal',
    title: 'Trade License Renewal',
    description: 'Annual trade license renewal process for mainland and free zone companies',
    status: 'active',
    lastUpdated: '2 days ago',
    templateCount: 2,
    viewCount: 89
  },
  {
    id: 'ubo-registration',
    title: 'Ultimate Beneficial Owner Registration',
    description: 'UBO registration requirements and process for UAE companies',
    status: 'active',
    lastUpdated: '1 week ago',
    templateCount: 2,
    viewCount: 67
  }
];

export default function SOPCategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const categoryInfo = categoryData[category as keyof typeof categoryData];

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Category Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The requested SOP category could not be found.
              </p>
              <Button onClick={() => navigate('/sop-resources')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to SOP Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSOPClick = (sopId: string) => {
    navigate(`/sop-resources/${category}/${sopId}`);
  };

  const handleCopyToClipboard = (sopId: string) => {
    // This would copy the SOP content to clipboard
    console.log(`Copying SOP ${sopId} to clipboard`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/sop-resources')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to SOP Center
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{categoryInfo.name}</h1>
            <p className="text-muted-foreground">{categoryInfo.description}</p>
          </div>
          <Button onClick={() => navigate('/sop-resources/manage')}>
            <Plus className="mr-2 h-4 w-4" />
            Add SOP
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${categoryInfo.name} SOPs...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* SOP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleSOPs.map((sop) => (
            <Card key={sop.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{sop.title}</CardTitle>
                    <Badge variant={sop.status === 'active' ? 'default' : 'secondary'}>
                      {sop.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {sop.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {sop.lastUpdated}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {sop.viewCount} views
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-4">
                  <span>{sop.templateCount} templates available</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleSOPClick(sop.id)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCopyToClipboard(sop.id)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State if no SOPs */}
        {sampleSOPs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No SOPs Found</h3>
              <p className="text-muted-foreground mb-4">
                No SOPs have been created for {categoryInfo.name} yet.
              </p>
              <Button onClick={() => navigate('/sop-resources/manage')}>
                <Plus className="mr-2 h-4 w-4" />
                Create First SOP
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
