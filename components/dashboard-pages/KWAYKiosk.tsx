'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, CheckSquare, FileText, ArrowRight, BarChart } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import KWAYKioskWizard from '@/components/wizards/kway-cpq/KWAYKioskWizard';
import OrdersList from '@/components/wizards/kway-cpq/OrdersList';

export default function KWAYKiosk() {
  const [orderStarted, setOrderStarted] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [showOrdersList, setShowOrdersList] = useState(false);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0
  });

  useEffect(() => {
    loadOrderStats();
  }, []);

  const loadOrderStats = async () => {
    try {
      const { data, error } = await supabase.from('order_intakes').select('status');
      if (error) throw error;

      if (data) {
        const completed = data.filter(item => item.status === 'completed').length;
        const inProgress = data.filter(item => item.status === 'draft').length;

        setOrderStats({
          total: data.length,
          completed,
          inProgress
        });
      }
    } catch (error) {
      console.error('Error loading order stats:', error);
    }
  };

  const handleOrderComplete = (orderId: string) => {
    setCompletedOrderId(orderId);
    setOrderStarted(false);
    loadOrderStats();
  };

  if (completedOrderId) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Order Submitted Successfully</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckSquare className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-medium">Thank you for your order!</p>
                <p className="text-muted-foreground">
                  Our team will contact you shortly to discuss the next steps.
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-center gap-4 pt-4">
                <Button variant="outline" onClick={() => setShowOrdersList(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  View All Orders
                </Button>

                <Button asChild>
                  <Link href="/">
                    <BarChart className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (orderStarted) return <KWAYKioskWizard onComplete={handleOrderComplete} />;

  if (showOrdersList) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
              <p className="text-muted-foreground">View and manage all service orders</p>
            </div>
            <Button onClick={() => setShowOrdersList(false)} variant="outline">
              ← Back to Kiosk
            </Button>
          </div>
          <OrdersList />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Service Order Kiosk</h1>
          <p className="text-muted-foreground">
            Configure and order accounting services for your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orderStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <CheckSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{orderStats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{orderStats.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border overflow-hidden">
          <div className="md:grid md:grid-cols-5">
            <div className="md:col-span-3 p-6 md:p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Configure Your Accounting Services</h2>
                <p className="text-muted-foreground">
                  Use our self-service wizard to configure and order accounting, payroll, tax, and HR services
                  tailored to your business needs.
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckSquare className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">8-Step Guided Process</p>
                      <p className="text-sm text-muted-foreground">
                        Simple questions to understand your needs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckSquare className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Instant Pricing</p>
                      <p className="text-sm text-muted-foreground">
                        Get transparent pricing based on your selections
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckSquare className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Flexible Services</p>
                      <p className="text-sm text-muted-foreground">
                        Customized to your business requirements
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <Button onClick={() => setOrderStarted(true)} size="lg">
                    Start Service Configuration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button onClick={() => setShowOrdersList(true)} variant="outline" size="lg">
                    View Orders
                    <FileText className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-muted p-6 md:p-8 flex items-center justify-center">
              <div className="space-y-6">
                <div className="space-y-2 text-center">
                  <h3 className="font-semibold text-lg">Services Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure your business services from these categories
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-background rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span>Accounting & Bookkeeping</span>
                  </div>

                  <div className="bg-background rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span>Payroll Services</span>
                  </div>

                  <div className="bg-background rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span>Tax Compliance</span>
                  </div>

                  <div className="bg-background rounded-lg p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span>HR & Compliance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
