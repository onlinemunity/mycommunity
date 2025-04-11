
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight, CreditCard } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/supabase';
import { toast } from '@/components/ui/use-toast';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  // If no user is authenticated, redirect to home
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Fetch order details if we have an orderId
    if (orderId) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('orders')
            .select('*, items:order_items(*)')
            .eq('id', orderId)
            .single();

          if (error) throw error;
          
          // Ensure status is a valid enum value
          if (data) {
            const validStatus = ['completed', 'pending', 'cancelled'].includes(data.status) 
              ? data.status as 'completed' | 'pending' | 'cancelled'
              : 'pending';
            
            // Validate membership_type to ensure it's a valid enum value
            const validMembershipType = ['yearly', 'lifetime'].includes(data.membership_type) 
              ? data.membership_type as 'yearly' | 'lifetime'
              : null;
            
            // Cast the data to Order type with the validated status and membership_type
            const typedOrder: Order = {
              ...data,
              status: validStatus,
              membership_type: validMembershipType
            };
            
            setOrder(typedOrder);
          }
        } catch (error: any) {
          console.error('Error fetching order:', error);
          toast({
            title: 'Error',
            description: 'Failed to load order details',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [user, navigate, orderId]);

  const handlePayNow = () => {
    // In a real application, this would redirect to a Stripe payment page
    toast({
      title: 'Payment',
      description: 'Redirecting to payment gateway...',
    });
    
    // Simulate successful payment after delay
    setTimeout(() => {
      // Update order status to completed
      const updateOrder = async () => {
        if (!orderId) return;
        
        try {
          const { error } = await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', orderId);
            
          if (error) throw error;
          
          // Update local state to reflect changes
          if (order) {
            setOrder({
              ...order,
              status: 'completed'
            });
          }
          
          toast({
            title: 'Payment Successful',
            description: 'Your payment has been processed successfully',
          });
          
          // Redirect to dashboard after successful payment
          navigate('/dashboard');
        } catch (error: any) {
          console.error('Error updating order:', error);
          toast({
            title: 'Error',
            description: 'Failed to process payment',
            variant: 'destructive',
          });
        }
      };
      
      updateOrder();
    }, 2000);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="page-transition py-16 md:py-24 container">
        <div className="max-w-md mx-auto text-center">
          <Card className="border-green-100">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Course Booked!</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <p className="text-muted-foreground mb-4">
                Your order has been successfully created. Please complete the payment to gain access to your purchased content.
              </p>
              {order && (
                <div className="text-sm border rounded-lg p-4 bg-muted/30 text-left mb-6">
                  <p className="font-medium mb-1">Order details:</p>
                  <p className="mb-1">Order Number: {order.invoice_number}</p>
                  <p className="mb-1">Total: ${order.total_amount}</p>
                  <p>Status: <span className="capitalize">{order.status}</span></p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button onClick={handlePayNow} className="w-full bg-accent1 hover:bg-accent1/90">
                <CreditCard className="mr-2 h-4 w-4" /> Pay Now
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
