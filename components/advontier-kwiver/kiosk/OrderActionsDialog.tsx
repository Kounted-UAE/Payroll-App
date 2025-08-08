import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSupabaseClient } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  reference_id?: string;
  status: string;
  estimated_monthly_cost?: number;
  estimated_annual_cost?: number;
  order_data: any;
  created_at: string;
}

interface OrderActionsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  mode: 'edit' | 'duplicate' | null;
}

export default function OrderActionsDialog({
  order,
  isOpen,
  onClose,
  onUpdate,
  mode
}: OrderActionsDialogProps) {
  const [formData, setFormData] = useState({
    reference_id: '',
    status: 'draft',
    estimated_monthly_cost: 0,
    estimated_annual_cost: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order && isOpen) {
      if (mode === 'duplicate') {
        setFormData({
          reference_id: `${order.reference_id || ''}-copy`,
          status: 'draft',
          estimated_monthly_cost: order.estimated_monthly_cost || 0,
          estimated_annual_cost: order.estimated_annual_cost || 0
        });
      } else {
        setFormData({
          reference_id: order.reference_id || '',
          status: order.status,
          estimated_monthly_cost: order.estimated_monthly_cost || 0,
          estimated_annual_cost: order.estimated_annual_cost || 0
        });
      }
    }
  }, [order, isOpen, mode]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // TODO: order_intakes table doesn't exist in current schema
      // This needs to be updated when the backend is properly converted
      console.log('Order operations disabled - table not available');
      
      toast({
        title: 'Info',
        description: 'Order operations are currently disabled during migration'
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: `Failed to ${mode} order`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'edit' ? 'Edit Order' : 'Duplicate Order';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="reference_id">Reference ID</Label>
            <Input
              id="reference_id"
              value={formData.reference_id}
              onChange={(e) => setFormData(prev => ({ ...prev, reference_id: e.target.value }))}
              placeholder="ORD-2024-001"
            />
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthly_cost">Monthly Cost (AED)</Label>
              <Input
                id="monthly_cost"
                type="number"
                value={formData.estimated_monthly_cost}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_monthly_cost: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="annual_cost">Annual Cost (AED)</Label>
              <Input
                id="annual_cost"
                type="number"
                value={formData.estimated_annual_cost}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_annual_cost: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Create')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}