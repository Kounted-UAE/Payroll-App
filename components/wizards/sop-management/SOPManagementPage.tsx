'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft,
  Search,
  Plus,
  Edit,
  Pause,
  Play,
  Archive,
  Eye,
  Copy,
  MoreHorizontal,
  Filter
} from 'lucide-react';
import { SOPWizard } from './SOPWizard';

const managementSOPs = [
  {
    id: 'corporate-tax-registration',
    title: 'Corporate Tax Registration',
    category: 'taxation',
    status: 'active',
    createdAt: '2024-01-15',
    lastUpdated: '3 days ago',
    author: 'Admin User',
    viewCount: 145,
    templateCount: 3
  },
  {
    id: 'trade-license-renewal',
    title: 'Trade License Renewal',
    category: 'company-registrations',
    status: 'active',
    createdAt: '2024-02-01',
    lastUpdated: '2 days ago',
    author: 'Admin User',
    viewCount: 89,
    templateCount: 2
  },
  {
    id: 'employee-visa-process',
    title: 'Employee Visa Processing',
    category: 'hr-visas',
    status: 'suspended',
    createdAt: '2024-01-20',
    lastUpdated: '1 week ago',
    author: 'HR Manager',
    viewCount: 67,
    templateCount: 4
  }
];

const categories = [
  'hr-visas',
  'accounting',
  'payroll',
  'taxation',
  'corporate-support',
  'company-formations',
  'company-registrations'
];

export default function SOPManagementPage() {
  const navigate = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showWizard, setShowWizard] = useState(false);
  const [editingSOP, setEditingSOP] = useState<string | null>(null);

  const handleStatusChange = (sopId: string, newStatus: string) => {
    console.log(`Changing SOP ${sopId} status to ${newStatus}`);
    // Implement status change logic
  };

  const handleEdit = (sopId: string) => {
    setEditingSOP(sopId);
    setShowWizard(true);
  };

  const handleView = (sopId: string, category: string) => {
    navigate.push(`/sop-resources/${category}/${sopId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'suspended':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusActions = (status: string) => {
    switch (status) {
      case 'active':
        return [
          { icon: Pause, label: 'Suspend', action: 'suspended' },
          { icon: Archive, label: 'Archive', action: 'archived' }
        ];
      case 'suspended':
        return [
          { icon: Play, label: 'Activate', action: 'active' },
          { icon: Archive, label: 'Archive', action: 'archived' }
        ];
      case 'archived':
        return [
          { icon: Play, label: 'Activate', action: 'active' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate.push('/sop-resources')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to SOP Center
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Manage SOPs</h1>
            <p className="text-muted-foreground">Create, edit, and manage Standard Operating Procedures</p>
          </div>
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create SOP
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search SOPs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Status: {statusFilter}
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Category: {categoryFilter}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SOPs Table */}
        <Card>
          <CardHeader>
            <CardTitle>All SOPs ({managementSOPs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {managementSOPs.map((sop) => (
                <div key={sop.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{sop.title}</h3>
                        <Badge variant={getStatusColor(sop.status)}>
                          {sop.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {sop.category.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <span>Created: {sop.createdAt}</span>
                        <span>Updated: {sop.lastUpdated}</span>
                        <span>By: {sop.author}</span>
                        <span>{sop.viewCount} views</span>
                        <span>{sop.templateCount} templates</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(sop.id, sop.category)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(sop.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                      
                      {/* Status Actions */}
                      {getStatusActions(sop.status).map((action, index) => (
                        <Button 
                          key={index}
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(sop.id, action.action)}
                          title={action.label}
                        >
                          <action.icon className="h-4 w-4" />
                        </Button>
                      ))}
                      
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SOP Wizard Modal */}
        {showWizard && (
          <SOPWizard
            isOpen={showWizard}
            onClose={() => {
              setShowWizard(false);
              setEditingSOP(null);
            }}
            editingSOP={editingSOP}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}
