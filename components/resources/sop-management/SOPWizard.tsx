
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/react-ui/dialog';
import { Button } from '@/components/react-ui/button';
import { Input } from '@/components/react-ui/input';
import { Textarea } from '@/components/react-ui/textarea';
import { Label } from '@/components/react-ui/label';
import { Badge } from '@/components/react-ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/react-ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/react-ui/card';
import { 
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  FileText,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface SOPWizardProps {
  isOpen: boolean;
  onClose: () => void;
  editingSOP?: string | null;
  categories: string[];
}

interface SOPFormData {
  title: string;
  category: string;
  status: string;
  whoAndWhen: string[];
  dataDocuments: {
    category: string;
    items: string[];
  }[];
  processSteps: {
    title: string;
    description: string;
    details: string[];
  }[];
  templates: {
    name: string;
    description: string;
    fields: string[];
  }[];
}

const initialFormData: SOPFormData = {
  title: '',
  category: '',
  status: 'active',
  whoAndWhen: [''],
  dataDocuments: [{ category: '', items: [''] }],
  processSteps: [{ title: '', description: '', details: [''] }],
  templates: [{ name: '', description: '', fields: [''] }]
};

export function SOPWizard({ isOpen, onClose, editingSOP, categories }: SOPWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SOPFormData>(initialFormData);

  const steps = [
    { number: 1, title: 'Basic Information', description: 'Title, category, and status' },
    { number: 2, title: 'Who & When', description: 'Define applicability and timing' },
    { number: 3, title: 'Data & Documents', description: 'Required information and documents' },
    { number: 4, title: 'Process Workflow', description: 'Step-by-step procedures' },
    { number: 5, title: 'Templates', description: 'Associated forms and templates' },
    { number: 6, title: 'Review & Save', description: 'Final review and submission' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    // Implement save logic
    console.log('Saving SOP:', formData);
    toast.success('SOP saved successfully!');
    onClose();
  };

  const addWhoAndWhenItem = () => {
    setFormData(prev => ({
      ...prev,
      whoAndWhen: [...prev.whoAndWhen, '']
    }));
  };

  const removeWhoAndWhenItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      whoAndWhen: prev.whoAndWhen.filter((_, i) => i !== index)
    }));
  };

  const updateWhoAndWhenItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      whoAndWhen: prev.whoAndWhen.map((item, i) => i === index ? value : item)
    }));
  };

  const addDataDocumentSection = () => {
    setFormData(prev => ({
      ...prev,
      dataDocuments: [...prev.dataDocuments, { category: '', items: [''] }]
    }));
  };

  const removeDataDocumentSection = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dataDocuments: prev.dataDocuments.filter((_, i) => i !== index)
    }));
  };

  const addProcessStep = () => {
    setFormData(prev => ({
      ...prev,
      processSteps: [...prev.processSteps, { title: '', description: '', details: [''] }]
    }));
  };

  const addTemplate = () => {
    setFormData(prev => ({
      ...prev,
      templates: [...prev.templates, { name: '', description: '', fields: [''] }]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">SOP Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter SOP title..."
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Label>Who & When Items</Label>
              <Button size="sm" onClick={addWhoAndWhenItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            {formData.whoAndWhen.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Textarea
                  value={item}
                  onChange={(e) => updateWhoAndWhenItem(index, e.target.value)}
                  placeholder="Describe who this applies to and when..."
                  className="flex-1"
                />
                {formData.whoAndWhen.length > 1 && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => removeWhoAndWhenItem(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <Label>Data & Documents Sections</Label>
              <Button size="sm" onClick={addDataDocumentSection}>
                <Plus className="h-4 w-4 mr-1" />
                Add Section
              </Button>
            </div>
            
            {formData.dataDocuments.map((section, sectionIndex) => (
              <Card key={sectionIndex}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Input
                      value={section.category}
                      onChange={(e) => {
                        const newDataDocs = [...formData.dataDocuments];
                        newDataDocs[sectionIndex].category = e.target.value;
                        setFormData(prev => ({ ...prev, dataDocuments: newDataDocs }));
                      }}
                      placeholder="Section category..."
                    />
                    {formData.dataDocuments.length > 1 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeDataDocumentSection(sectionIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-2 mb-2">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newDataDocs = [...formData.dataDocuments];
                          newDataDocs[sectionIndex].items[itemIndex] = e.target.value;
                          setFormData(prev => ({ ...prev, dataDocuments: newDataDocs }));
                        }}
                        placeholder="Required document or data..."
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => {
                          const newDataDocs = [...formData.dataDocuments];
                          newDataDocs[sectionIndex].items.push('');
                          setFormData(prev => ({ ...prev, dataDocuments: newDataDocs }));
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <Label>Process Steps</Label>
              <Button size="sm" onClick={addProcessStep}>
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
            
            {formData.processSteps.map((step, stepIndex) => (
              <Card key={stepIndex}>
                <CardHeader>
                  <CardTitle className="text-xs">Step {stepIndex + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    value={step.title}
                    onChange={(e) => {
                      const newSteps = [...formData.processSteps];
                      newSteps[stepIndex].title = e.target.value;
                      setFormData(prev => ({ ...prev, processSteps: newSteps }));
                    }}
                    placeholder="Step title..."
                  />
                  <Textarea
                    value={step.description}
                    onChange={(e) => {
                      const newSteps = [...formData.processSteps];
                      newSteps[stepIndex].description = e.target.value;
                      setFormData(prev => ({ ...prev, processSteps: newSteps }));
                    }}
                    placeholder="Step description..."
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <Label>Templates & Forms</Label>
              <Button size="sm" onClick={addTemplate}>
                <Plus className="h-4 w-4 mr-1" />
                Add Template
              </Button>
            </div>
            
            {formData.templates.map((template, templateIndex) => (
              <Card key={templateIndex}>
                <CardContent className="p-4 space-y-3">
                  <Input
                    value={template.name}
                    onChange={(e) => {
                      const newTemplates = [...formData.templates];
                      newTemplates[templateIndex].name = e.target.value;
                      setFormData(prev => ({ ...prev, templates: newTemplates }));
                    }}
                    placeholder="Template name..."
                  />
                  <Textarea
                    value={template.description}
                    onChange={(e) => {
                      const newTemplates = [...formData.templates];
                      newTemplates[templateIndex].description = e.target.value;
                      setFormData(prev => ({ ...prev, templates: newTemplates }));
                    }}
                    placeholder="Template description..."
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="h-16 w-16 text-zinc-500 mx-auto mb-4" />
              <h3 className="text-xs font-semibold mb-2">Review Your SOP</h3>
              <p className="text-zinc-400 mb-6">
                Please review the information below before saving.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium">Title:</Label>
                <p className="text-xs text-zinc-400">{formData.title}</p>
              </div>
              <div>
                <Label className="text-xs font-medium">Category:</Label>
                <Badge variant="outline">{formData.category}</Badge>
              </div>
              <div>
                <Label className="text-xs font-medium">Status:</Label>
                <Badge>{formData.status}</Badge>
              </div>
              <div>
                <Label className="text-xs font-medium">Who & When Items:</Label>
                <p className="text-xs text-zinc-400">{formData.whoAndWhen.length} items</p>
              </div>
              <div>
                <Label className="text-xs font-medium">Data Document Sections:</Label>
                <p className="text-xs text-zinc-400">{formData.dataDocuments.length} sections</p>
              </div>
              <div>
                <Label className="text-xs font-medium">Process Steps:</Label>
                <p className="text-xs text-zinc-400">{formData.processSteps.length} steps</p>
              </div>
              <div>
                <Label className="text-xs font-medium">Templates:</Label>
                <p className="text-xs text-zinc-400">{formData.templates.length} templates</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingSOP ? 'Edit SOP' : 'Create New SOP'}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6 px-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                currentStep >= step.number 
                  ? 'bg-zinc-500 text-zinc-500-foreground' 
                  : 'bg-zinc-100 text-zinc-400'
              }`}>
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-zinc-500' : 'bg-zinc-100'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold mb-2">
            {steps[currentStep - 1].title}
          </h3>
          <p className="text-xs text-zinc-400 mb-4">
            {steps[currentStep - 1].description}
          </p>
          
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save SOP
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
