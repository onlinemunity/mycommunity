
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Download, Receipt } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/types/supabase';

export const OrderHistory = () => {
  const { user } = useAuth();
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState<string | null>(null);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });

  const handleGenerateInvoice = (orderId: string) => {
    setIsGeneratingInvoice(orderId);
    // Mock invoice generation
    setTimeout(() => {
      setIsGeneratingInvoice(null);
      // In a real app, this would download a PDF
      window.alert('Invoice would be downloaded in a real application');
    }, 1500);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'paid':
        return <Badge className="bg-blue-500">Paid</Badge>;
      case 'processing':
        return <Badge className="bg-purple-500">Processing</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatMembershipType = (type: string | null | undefined) => {
    switch(type) {
      case 'premium':
        return 'Premium Membership';
      case 'pro':
        return 'Pro Membership';
      case 'basic':
        return 'Basic Membership';
      default:
        return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-accent1" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading orders</p>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-8">
          <div className="flex flex-col items-center">
            <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
            <p className="text-muted-foreground">
              You haven't made any purchases yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-accent1" />
                    <span className="font-medium">
                      Order {order.invoice_number || order.id.substring(0, 8)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), 'PPP')}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(order.status)}
                  <span className="font-semibold">${order.total_amount.toFixed(2)}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleGenerateInvoice(order.id)}
                    disabled={isGeneratingInvoice === order.id}
                  >
                    {isGeneratingInvoice === order.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="bg-secondary/40 rounded-md p-3">
                <div className="text-sm font-medium mb-2">Order Details</div>
                <div className="text-sm">
                  <p className="mb-1">
                    <span className="font-medium">Membership Type:</span>{' '}
                    {formatMembershipType(order.membership_type)}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Billing Name:</span> {order.billing_name || 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Billing Email:</span> {order.billing_email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
