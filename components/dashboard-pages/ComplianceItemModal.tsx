'use client'

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Building2, 
  Users, 
  AlertTriangle,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface ComplianceItemModalProps {
  item: ComplianceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ComplianceItemModal({ item, isOpen, onClose }: ComplianceItemModalProps) {
  const router = useRouter();

  if (!item) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tax':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'labor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'corporate':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'licensing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'regulatory':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'one-time':
        return 'bg-gray-100 text-gray-800';
      case 'monthly':
        return 'bg-red-100 text-red-800';
      case 'quarterly':
        return 'bg-orange-100 text-orange-800';
      case 'semi-annual':
        return 'bg-yellow-100 text-yellow-800';
      case 'annual':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewSOP = () => {
    // Map the obligation to an SOP ID (in a real app, this would be part of the data)
    let sopId = item.obligation.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    // Handle specific mappings
    if (item.obligation.includes('Trade License Renewal')) {
      sopId = 'trade-license-renewal';
    } else if (item.obligation.includes('Ultimate Beneficial Owner')) {
      sopId = 'ubo-registration';
    } else if (item.obligation.includes('VAT Registration')) {
      sopId = 'vat-registration';
    } else if (item.obligation.includes('Corporate Tax')) {
      sopId = 'corporate-tax-return';
    } else if (item.obligation.includes('Emiratisation')) {
      sopId = 'emiratisation-compliance';
    } else if (item.obligation.includes('GPSSA Pension')) {
      sopId = 'gpssa-pension-contributions';
    }
    
    onClose();
    router.push(`/dashboard/compliance/sop/${sopId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {item.obligation}
            {item.isObsolete && (
              <Badge variant="destructive" className="ml-2">
                OBSOLETE
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">Due Date</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">{item.dueDate}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-medium">Authority</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">{item.authority}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Category & Frequency</span>
              </div>
              <div className="flex gap-2 ml-6">
                <Badge className={getCategoryColor(item.category)}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Badge>
                <Badge className={getFrequencyColor(item.frequency)}>
                  {item.frequency.replace('-', ' ')}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">Subject Matter</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">{item.subjectMatter}</p>
            </div>
          </div>

          <Separator />

          {/* Jurisdiction */}
          <div>
            <h3 className="font-semibold mb-2">Jurisdiction</h3>
            <p className="text-sm text-muted-foreground">{item.jurisdiction}</p>
          </div>

          {/* Applicable Entities */}
          <div>
            <h3 className="font-semibold mb-2">Applicable Entities</h3>
            <p className="text-sm text-muted-foreground">{item.entities}</p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="font-semibold mb-2">Requirements & Documents</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.requirements}</p>
          </div>

          {/* Penalties */}
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <h3 className="font-semibold text-destructive">Penalties for Non-Compliance</h3>
            </div>
            <p className="text-sm text-destructive/80 leading-relaxed">{item.penalties}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleViewSOP} className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              View Detailed SOP & Documentation
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <p className="font-medium mb-1">Important Note:</p>
            <p>
              This information is for reference only and should not replace professional legal or 
              compliance advice. Always consult with qualified professionals and check the latest 
              regulations before making compliance decisions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}