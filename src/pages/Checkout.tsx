
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2, 
  Lock 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  zipCode: z.string().min(3, 'Zip/Postal code is required'),
  country: z.string().min(2, 'Country is required')
});

type FormValues = z.infer<typeof formSchema>;

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: user?.email || '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  // Check if user is logged in, if not redirect to auth page
  useEffect(() => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to complete checkout",
        variant: "destructive"
      });
      navigate('/auth?redirect=checkout');
      return;
    }
    
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [user, items, navigate]);

  // Populate form with user profile data if available
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          form.setValue('fullName', data.full_name || '');
        }
      };
      
      fetchProfile();
    }
  }, [user, form]);

  // Get membership type from cart
  const membershipType = items.find(item => 
    item.type === 'yearly_membership' || item.type === 'lifetime_membership'
  )?.type.split('_')[0] as 'yearly' | 'lifetime' | undefined;

  const updateUserProfile = async (values: FormValues) => {
    if (!user) return;
    
    try {
      // Update user profile with billing details
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName
        })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      // Refresh profile to get updated info
      await refreshProfile();
      
      return true;
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Failed to update profile",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive"
      });
      return false;
    }
  };

  const createOrder = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to complete checkout",
        variant: "destructive"
      });
      navigate('/auth?redirect=checkout');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create invoice number
      const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

      // Create order in the database with 'pending' status
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending', // Set as pending until payment is completed
          total_amount: totalPrice,
          payment_method: 'credit_card',
          membership_type: membershipType,
          invoice_number: invoiceNumber,
          billing_name: values.fullName,
          billing_email: values.email,
          billing_address: values.address,
          billing_city: values.city,
          billing_state: values.state,
          billing_zip: values.zipCode,
          billing_country: values.country
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        item_type: item.type,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // For testing purposes, update the user's profile with the membership type
      // In a real application, this would happen after payment confirmation
      if (membershipType) {
        const membershipExpiresAt = membershipType === 'yearly' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() 
          : null;

        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({
            user_type: membershipType,
            membership_expires_at: membershipExpiresAt
          })
          .eq('id', user.id);

        if (profileUpdateError) {
          console.error('Error updating profile membership:', profileUpdateError);
          // Don't throw here, we still want to proceed with the order
        }
      }

      return order.id;
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast({
        title: "Failed to create order",
        description: error.message || "There was an error creating your order. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    // First update the user profile
    const profileUpdated = await updateUserProfile(values);
    if (!profileUpdated) return;

    // Then create the order
    const createdOrderId = await createOrder(values);
    if (createdOrderId) {
      // Redirect to success page with the order ID
      navigate(`/checkout/success?orderId=${createdOrderId}`);
      
      // Clear the cart after successful order creation
      clearCart();
      
      toast({
        title: "Order created successfully",
        description: "Your order has been placed successfully.",
      });
    }
  };

  if (items.length === 0 && !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="page-transition py-16 md:py-24 container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mb-4"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h1 className="text-3xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Enter your billing address details</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State/Province</FormLabel>
                              <FormControl>
                                <Input placeholder="NY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip/Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="United States" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="pt-2">
                        <Button 
                          type="submit" 
                          className="w-full button-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Complete Upgrade'
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                      </div>
                    ))}
                    <Separator className="my-3" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 flex flex-col items-start p-4 text-sm space-y-2 rounded-b-lg">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Instant Access After Purchase</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
