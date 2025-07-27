import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, FileText, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { ActionButtons } from '@/components/ui/action-buttons';
import OrderActionsDialog from '@/components/wizards/korp-kiosk/OrderActionsDialog';

interface Order {
  id: string;
  reference_id?: string;
  status: string;
  estimated_monthly_cost?: number;
  estimated_annual_cost?: number;
  order_data: any;
  created_at: string;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogMode, setDialogMode] = useState<'edit' | 'duplicate' | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('order_intakes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('order_intakes')
        .delete()
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.filter(order => order.id !== orderId));
      toast({
        title: 'Success',
        description: 'Order deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete order',
        variant: 'destructive'
      });
    }
  };

  const handleSendEmail = async (order: Order) => {
    try {
      const { error } = await supabase.functions.invoke('send-order-email', {
        body: { orderId: order.id }
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order email sent successfully'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send email. Please check if Resend is configured.',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const filteredOrders = orders.filter(order =>
    (order.reference_id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No orders found matching your search.' : 'No orders yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <h3 className="font-semibold text-xs">
                          {order.reference_id || `Order ${order.id.slice(0, 8)}`}
                        </h3>
                        <Badge variant={getStatusColor(order.status) as any}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        {order.estimated_monthly_cost && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            AED {order.estimated_monthly_cost}/month
                          </div>
                        )}
                        {order.estimated_annual_cost && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            AED {order.estimated_annual_cost}/year
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <ActionButtons
                      onEdit={() => {
                        setSelectedOrder(order);
                        setDialogMode('edit');
                      }}
                      onDuplicate={() => {
                        setSelectedOrder(order);
                        setDialogMode('duplicate');
                      }}
                      onDelete={() => handleDelete(order.id)}
                      onSend={() => handleSendEmail(order)}
                      deleteTitle="Delete Order"
                      deleteDescription="Are you sure you want to delete this order? This action cannot be undone."
                      sendLabel="Send Summary"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <OrderActionsDialog
        order={selectedOrder}
        isOpen={!!selectedOrder && !!dialogMode}
        onClose={() => {
          setSelectedOrder(null);
          setDialogMode(null);
        }}
        onUpdate={loadOrders}
        mode={dialogMode}
      />
    </div>
  );
}