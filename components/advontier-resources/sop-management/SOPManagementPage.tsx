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
import { useSOPs } from '@/hooks/useSOPs';

export default function SOPManagementPage() {
  const navigate = useRouter();
  const { sops, categories, searchSOPs, loading, error } = useSOPs();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showWizard, setShowWizard] = useState(false);
  const [editingSOP, setEditingSOP] = useState<string | null>(null);

  const handleStatusChange = (sopId: string, newStatus: string) => {
    console.log(`Changing SOP ${sopId} status to ${newStatus}`);
    // TODO: Implement status change logic with database update
  };

  const handleEdit = (sopId: string) => {
    setEditingSOP(sopId);
    setShowWizard(true);
  };

  const handleView = (sopId: string, category: string) => {
    navigate.push(`/backyard/sop-resources/${category}/${sopId}`);
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

  const filteredSOPs = searchSOPs({
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: searchQuery
  });

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-lg font-semibold mb-2">Error Loading SOPs</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate.push('/backyard/sop-resources')}>
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
            <CardTitle>All SOPs ({filteredSOPs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSOPs.map((sop) => {
                const category = categories.find(c => c.id === sop.category);
                return (
                  <div key={sop.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{sop.title}</h3>
                          <Badge variant={getStatusColor(sop.status)}>
                            {sop.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {category?.name || sop.category.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                          <span>Created: {getTimeAgo(new Date(sop.created_at))}</span>
                          <span>Updated: {getTimeAgo(new Date(sop.updated_at))}</span>
                          <span>{sop.view_count} views</span>
                          <span>{sop.template_count} templates</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {sop.description}
                        </p>
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
                );
              })}
            </div>

            {/* Empty State */}
            {filteredSOPs.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No SOPs Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? 'No SOPs match your current filters.'
                    : 'No SOPs have been created yet.'
                  }
                </p>
                <Button onClick={() => setShowWizard(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First SOP
                </Button>
              </div>
            )}
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
            categories={categories.map(c => c.id)}
          />
        )}
      </div>
    </div>
  );
}
