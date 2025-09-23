'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/react-ui/card';
import { Badge } from '@/components/react-ui/badge';
import { Button } from '@/components/react-ui/button';
import { Input } from '@/components/react-ui/input';
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
import { useRouter } from 'next/navigation';
import { useSOPs } from '@/hooks/useSOPs';

const categoryIcons = {
  'hr-visas': Users,
  'accounting': Calculator,
  'payroll': Receipt,
  'taxation': FileText,
  'corporate-support': Briefcase,
  'company-formations': Building2,
  'company-registrations': FileCheck,
};

export default function SOPResourceCenter() {
  const navigate = useRouter();
  const { categories, stats, getRecentSOPs, loading, error } = useSOPs();
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = (categoryId: string) => {
    navigate.push(`/kounted/sop-resources/${categoryId}`);
  };

  const handleSOPClick = (categoryId: string, sopId: string) => {
    navigate.push(`/kounted/sop-resources/${categoryId}/${sopId}`);
  };

  const recentSOPs = getRecentSOPs(4);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-100 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-zinc-100 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-zinc-100 rounded"></div>
              </div>
            ))}
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
              <p className="text-zinc-400 mb-4">{error}</p>
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
          <h1 className="text-lg text-zinc-600 font-bold">SOP Resource Center</h1>
            <p className="text-zinc-400">
              Comprehensive Standard Operating Procedures for kounted's 7 Solution Groups
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate.push('/kounted/sop-resources/manage')}>
              <Plus className="mr-2 h-4 w-4" />
              Add SOP
            </Button>
            <Button variant="outline" onClick={() => navigate.push('/kounted/sop-resources/manage')}>
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
                  <p className="text-xs font-bold">{stats.total_sops}</p>
                  <p className="text-xs text-zinc-400">Total SOPs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold">{stats.solution_groups}</p>
                  <p className="text-xs text-zinc-400">Solution Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold">{stats.recent_updates}</p>
                  <p className="text-xs text-zinc-400">Recent Updates</p>
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
                  <p className="text-xs font-bold">{stats.most_popular}</p>
                  <p className="text-xs text-zinc-400">Most Popular</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
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
          <h2 className="text-xs font-semibold mb-6">kounted Solution Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || FileText;
              return (
                <Card 
                  key={category.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 ${category.color} rounded-lg`}>
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{category.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {category.sop_count} SOPs
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400">
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
                const Icon = categoryIcons[sop.category as keyof typeof categoryIcons] || FileText;
                const timeAgo = getTimeAgo(new Date(sop.updated_at));
                
                return (
                  <div 
                    key={sop.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-zinc-100/50 cursor-pointer transition-colors"
                    onClick={() => handleSOPClick(sop.category, sop.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 ${category?.color} rounded`}>
                        <Icon className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{sop.title}</h4>
                        <p className="text-xs text-zinc-400">
                          {category?.name} • Updated {timeAgo}
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

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}
