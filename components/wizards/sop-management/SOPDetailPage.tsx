
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const sopDetailData = {
  'corporate-tax-registration': {
    title: 'Corporate Tax Registration',
    category: 'taxation',
    status: 'active',
    lastUpdated: '3 days ago',
    whoAndWhen: [
      'All companies (mainland and free zone) are required to register for Corporate Tax with the FTA, even if they expect to be taxed at 0% (free zone) or have no profit, unless explicitly exempt.',
      'The Ministry of Finance set staggered deadlines in 2024 for existing companies\' registration, depending on license issuance month.',
      'For example, a company licensed Jan-Feb had to register by May 31, 2024; those licensed later by subsequent monthly deadlines up to Dec 31, 2024.',
      'New companies (incorporated from 2024 onward) must register within 30 days of receiving their trade license or before earning any taxable income.'
    ],
    dataDocumentsRequired: [
      {
        category: 'Trade License Information',
        items: [
          'License number, license issue date, issuing authority (Emirate or free zone)'
        ]
      },
      {
        category: 'Company Details',
        items: [
          'Legal name in English (and Arabic if required)',
          'Legal form (LLC, PJSC, branch, etc.)',
          'Date of incorporation',
          'Emirates where it operates'
        ]
      },
      {
        category: 'Authorized Signatory',
        items: [
          'Details of the person submitting (name, Emirates ID/passport, designation)',
          'Proof of authorization if needed (board resolution or POA)',
          'Note: Portal may not explicitly ask for upload unless person is not on license'
        ]
      },
      {
        category: 'Contact Details',
        items: [
          'Company address, phone, email'
        ]
      },
      {
        category: 'Financial Information',
        items: [
          'Financial year adopted by the company for tax purposes (e.g., Jan–Dec, or April–Mar, etc.)',
          'Provide the year-end date'
        ]
      },
      {
        category: 'Business Activities',
        items: [
          'General description or sector selection for the company\'s activities'
        ]
      },
      {
        category: 'Ownership',
        items: [
          'Additional info may be required on parent company if part of multinational group',
          'CT system may eventually handle group tax issues',
          'Currently, registration is straightforward with basic info'
        ]
      }
    ],
    processWorkflow: [
      {
        step: 1,
        title: 'Access EmaraTax',
        description: 'The same FTA e-Services platform is used. If the company already has an account (e.g., for VAT), the CT registration can be done under the same login. Otherwise, create a new account.',
        details: []
      },
      {
        step: 2,
        title: 'Fill Corporate Tax Registration Form',
        description: 'After logging in, select "Register for Corporate Tax". Input all requested details. Key fields:',
        details: [
          'Identification: Are you an existing tax registrant (for VAT)? If yes, some info pre-fills. If no, fill fresh.',
          'Legal Info: Enter license number and attach a copy of trade license. Enter the regulatory authority and license expiry date.',
          'Financial Period: Choose the start and end month of the financial year. Commonly Jan 1 – Dec 31, but match company\'s actual fiscal year.',
          'Contact Details: Company address (as per license or principal place of business), best contact number and email.',
          'Authorized Signatory: Provide personal details. Upload ID/passport if required. If person is not licensee/manager, upload Letter of Authority.',
          'Declaration: Confirm accuracy and submit.'
        ]
      },
      {
        step: 3,
        title: 'Approval',
        description: 'The FTA processes CT registrations. Once approved, the company is assigned a Tax Registration Number (TRN) for Corporate Tax.',
        details: [
          'TRN is distinct from VAT TRN',
          'Download the CT Registration Certificate showing TRN and effective date'
        ]
      }
    ],
    templates: [
      {
        name: 'CT Registration Info Sheet',
        description: 'Form to collect needed data from the client',
        fields: ['Trade license details', 'All owners\' names', 'Financial year', 'Group information', 'Authorized signatory identification']
      },
      {
        name: 'Board Resolution for Tax Registration',
        description: 'Resolution authorizing company to register for CT',
        fields: ['Company name', 'Resolution clauses', 'Authorized signatory appointment', 'Directors\' signatures']
      }
    ],
    relatedSOPs: ['vat-registration', 'trade-license-renewal', 'ubo-registration']
  }
};

export default function SOPDetailPage() {
  const { category, sopId } = useParams();
  const navigate = useNavigate();
  
  const sopData = sopDetailData[sopId as keyof typeof sopDetailData];

  if (!sopData) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">SOP Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The requested Standard Operating Procedure could not be found.
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

  const handleCopyToClipboard = async () => {
    const sopContent = `
${sopData.title}

Who & When:
${sopData.whoAndWhen.map(item => `• ${item}`).join('\n')}

Data/Documents Required:
${sopData.dataDocumentsRequired.map(section => `
${section.category}:
${section.items.map(item => `• ${item}`).join('\n')}`).join('\n')}

Process Workflow:
${sopData.processWorkflow.map(step => `
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(`/sop-resources/${category}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {category?.replace('-', ' ')}
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">{sopData.title}</h1>
            <p className="text-muted-foreground">Standard Operating Procedure</p>
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
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <p className="text-sm text-muted-foreground">{sopData.lastUpdated}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Category</span>
              </div>
              <Badge>{category?.replace('-', ' ')}</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Status</span>
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
              <Building2 className="h-5 w-5" />
              Who & When
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sopData.whoAndWhen.map((item, index) => (
                <li key={index} className="text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
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
              <FileText className="h-5 w-5" />
              Data/Documents Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sopData.dataDocumentsRequired.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-2 text-primary">{section.category}</h4>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {index < sopData.dataDocumentsRequired.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Process Workflow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Process Workflow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sopData.processWorkflow.map((step, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{step.title}</h4>
                    <p className="text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
                
                {step.details.length > 0 && (
                  <div className="ml-11">
                    <ul className="space-y-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {index < sopData.processWorkflow.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
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
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
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
        {sopData.relatedSOPs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Related SOPs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sopData.relatedSOPs.map((sopId, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/sop-resources/${category}/${sopId}`)}
                  >
                    {sopId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
