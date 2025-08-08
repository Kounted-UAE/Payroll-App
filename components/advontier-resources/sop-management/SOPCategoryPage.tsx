'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
  Filter,
} from 'lucide-react'
import { useSOPs } from '@/hooks/useSOPs'

export default function SOPCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const { getSOPsByCategory, getCategoryById, incrementViewCount, loading, error } = useSOPs()
  
  const categoryId = params?.category as string
  const categoryInfo = getCategoryById(categoryId)
  const categorySOPs = getSOPsByCategory(categoryId)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const goTo = (path: string) => router.push(path)

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-lg font-semibold mb-2">Error Loading Category</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-lg font-semibold mb-2">Category Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The requested SOP category could not be found.
              </p>
              <Button onClick={() => goTo('/backyard/sop-resources')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to SOP Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleSOPClick = async (sopId: string) => {
    await incrementViewCount(sopId)
    goTo(`/backyard/sop-resources/${categoryId}/${sopId}`)
  }

  const handleCopyToClipboard = (sopId: string) => {
    console.log(`Copying SOP ${sopId} to clipboard`)
  }

  const filteredSOPs = categorySOPs.filter(sop => {
    const matchesSearch = searchQuery === '' || 
      sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || sop.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => goTo('/backyard/sop-resources')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to SOP Center
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{categoryInfo.name}</h1>
            <p className="text-muted-foreground">{categoryInfo.description}</p>
          </div>
          <Button onClick={() => goTo('/backyard/sop-resources/manage')}>
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
          {filteredSOPs.map((sop) => (
            <Card key={sop.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm mb-2">{sop.title}</CardTitle>
                    <Badge variant={sop.status === 'active' ? 'default' : 'secondary'}>
                      {sop.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {sop.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {getTimeAgo(new Date(sop.updated_at))}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {sop.view_count} views
                  </span>
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  <span>{sop.template_count} templates available</span>
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
        {filteredSOPs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No SOPs Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No SOPs match your current filters.'
                  : `No SOPs have been created for ${categoryInfo.name} yet.`
                }
              </p>
              <Button onClick={() => goTo('/backyard/sop-resources/manage')}>
                <Plus className="mr-2 h-4 w-4" />
                Create First SOP
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
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
