
'use client'

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  Copy,
  Download,
  Edit,
  FileText,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ClipboardCopy
} from 'lucide-react';
import { toast } from 'sonner';
import { useSOPs } from '@/hooks/useSOPs';

export default function SOPDetailPage() {
  const { category, sopId } = useParams<{ category: string; sopId: string }>();
  const navigate = useRouter();
  const { getSOPById, getCategoryById, incrementViewCount, loading, error } = useSOPs();
  
  const sopData = getSOPById(sopId as string);
  const categoryInfo = getCategoryById(category as string);

  useEffect(() => {
    if (sopId && !loading) {
      incrementViewCount(sopId);
    }
  }, [sopId, loading, incrementViewCount]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
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
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Error Loading SOP</h2>
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

  if (!sopData) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">SOP Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The requested Standard Operating Procedure could not be found.
              </p>
              <Button onClick={() => navigate.push('/backyard/sop-resources')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to SOP Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleCopyToClipboard = async () => {
    const sopContent = `
${sopData.title}

Who & When:
${sopData.who_and_when.map(item => `• ${item}`).join('\n')}

Data/Documents Required:
${sopData.data_documents_required.map(section => `
${section.category}:
${section.items.map(item => `• ${item}`).join('\n')}`).join('\n')}

Process Workflow:
${sopData.process_workflow.map(step => `
${step.step}. ${step.title}
${step.description}
${step.details.map(detail => `• ${detail}`).join('\n')}`).join('\n')}

Templates:
${sopData.templates.map(template => `• ${template.name}: ${template.description}`).join('\n')}
    `;
    
    try {
      await navigator.clipboard.writeText(sopContent);
      toast.success('SOP copied to clipboard successfully!');
    } catch (err) {
      toast.error('Failed to copy SOP to clipboard');
    }
  };

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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate.push(`/backyard/sop-resources/${category}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {categoryInfo?.name || category?.replace('-', ' ')}
          </Button>
          <div className="flex-1">
          <h1 className="text-lg text-zinc-600 font-bold">{sopData.title}</h1>
            <p className="text-blue-400">Standard Operating Procedure</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              <ClipboardCopy className="mr-2 h-4 w-4" />
              Copy SOP
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium">Last Updated</span>
              </div>
              <p className="text-xs text-muted-foreground">{getTimeAgo(new Date(sopData.updated_at))}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium">Category</span>
              </div>
              <Badge>{categoryInfo?.name || category?.replace('-', ' ')}</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium">Status</span>
              </div>
              <Badge variant={sopData.status === 'active' ? 'default' : 'secondary'}>
                {sopData.status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Who & When */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Who & When
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sopData.who_and_when.map((item, index) => (
                <li key={index} className="text-muted-foreground flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Data/Documents Required */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Data/Documents Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sopData.data_documents_required.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-2 text-blue-500">{section.category}</h4>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-muted-foreground flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {index < sopData.data_documents_required.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Process Workflow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Process Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sopData.process_workflow.map((step, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-blue-500-foreground rounded-full text-xs font-medium">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{step.title}</h4>
                    <p className="text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
                
                {step.details.length > 0 && (
                  <div className="ml-11">
                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {index < sopData.process_workflow.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Templates & Forms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sopData.templates.map((template, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{template.name}</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                  <div>
                    <p className="text-xs font-medium mb-2">Required Fields:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.fields.map((field, fieldIndex) => (
                        <Badge key={fieldIndex} variant="outline" className="text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Related SOPs */}
        {sopData.related_sops.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Related SOPs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sopData.related_sops.map((relatedSopId, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => navigate.push(`/backyard/sop-resources/${category}/${relatedSopId}`)}
                  >
                    {relatedSopId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
