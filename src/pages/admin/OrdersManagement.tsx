
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Search, Loader2, FileText, Info, CalendarRange, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/supabase';
import { format } from 'date-fns';

const OrdersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  // Fetch orders
  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Orders data:', data);
      return data as Order[] || [];
    },
  });

  // Filter orders
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      (order.invoice_number && order.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.billing_email && order.billing_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.billing_name && order.billing_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Handle status change
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      
      await refetch();
      
      toast({
        title: "Status updated",
        description: `Order status has been updated to ${newStatus}`,
      });
    } catch (err) {
      toast({
        title: "Update failed",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // View order details
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  // Format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP p");
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Create test order function - for debugging only
  const createTestOrder = async () => {
    try {
      // Get any user for testing
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (!usersData || usersData.length === 0) {
        toast({
          title: "No users found",
          description: "Cannot create test order without users",
          variant: "destructive",
        });
        return;
      }

      const userId = usersData[0].id;
      const invoiceNumber = `TEST-${Date.now().toString().slice(-8)}`;

      // Create the order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: 49.99,
          status: 'pending',
          payment_method: 'credit_card',
          membership_type: 'premium',
          invoice_number: invoiceNumber,
          billing_name: 'Test User',
          billing_email: 'test@example.com',
          billing_address: '123 Test St',
          billing_city: 'Test City',
          billing_state: 'TS',
          billing_zip: '12345',
          billing_country: 'Testland'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order item
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData.id,
          item_type: 'premium_membership',
          price: 49.99
        });

      if (itemError) throw itemError;

      await refetch();
      
      toast({
        title: "Test order created",
        description: "A test order has been created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error creating test order",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-[calc(100vh-120px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error loading orders</h2>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Orders Management</h2>
            <p className="text-muted-foreground">Track and manage all customer orders</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => refetch()} variant="outline" size="sm" className="h-9">
              <Loader2 className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={createTestOrder} variant="outline" size="sm" className="h-9">
              <FileText className="mr-2 h-4 w-4" />
              Create Test Order
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by invoice, email or name..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> 
                <span>Status: {statusFilter === 'all' ? 'All' : statusFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Orders table */}
        <Card>
          <CardHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
                </CardDescription>
              </div>
              {orders && orders.length > 0 && filteredOrders.length === 0 && (
                <Badge variant="outline">No matching orders</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {orders && orders.length > 0 ? (
              <div className="overflow-hidden rounded-b-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Membership</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.invoice_number || 'N/A'}</TableCell>
                          <TableCell>
                            <div>
                              <div>{order.billing_name || 'N/A'}</div>
                              <div className="text-xs text-muted-foreground">{order.billing_email || 'N/A'}</div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(order.created_at)}
                          </TableCell>
                          <TableCell>${order.total_amount?.toFixed(2) || '0.00'}</TableCell>
                          <TableCell>
                            {getStatusBadge(order.status || 'pending')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {order.membership_type ? order.membership_type.charAt(0).toUpperCase() + order.membership_type.slice(1) : 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewDetails(order)}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                              <Select 
                                value={order.status || 'pending'}
                                onValueChange={(value) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className="h-8 w-24">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="paid">Paid</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          No orders match your filters. Try adjusting your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Orders Yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  There are no orders in the system yet.
                </p>
                <Button onClick={createTestOrder} variant="outline" size="sm">
                  Create Test Order
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Order details dialog */}
      {selectedOrder && (
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">Invoice</div>
                  <div className="text-xl font-bold">{selectedOrder.invoice_number || 'N/A'}</div>
                  <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                    <CalendarRange className="h-3.5 w-3.5" />
                    {formatDate(selectedOrder.created_at)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">Status</div>
                  {getStatusBadge(selectedOrder.status || 'pending')}
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Customer Info</h3>
                  <div className="bg-muted/40 p-3 rounded-md space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {selectedOrder.billing_name || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedOrder.billing_email || 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold">Billing Details</h3>
                  <div className="bg-muted/40 p-3 rounded-md space-y-2 text-sm">
                    <div>
                      {selectedOrder.billing_address || 'N/A'}{selectedOrder.billing_address ? ',' : ''}
                      <br />
                      {selectedOrder.billing_city || 'N/A'}{selectedOrder.billing_city && selectedOrder.billing_state ? ', ' : ''}
                      {selectedOrder.billing_state || ''}
                      <br />
                      {selectedOrder.billing_zip || 'N/A'}{selectedOrder.billing_zip && selectedOrder.billing_country ? ', ' : ''}
                      {selectedOrder.billing_country || ''}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-3">Order Details</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item, index) => (
                          <TableRow key={item.id || index}>
                            <TableCell className="font-medium">
                              {item.item_type === 'premium_membership' ? 'Premium Membership' : 
                               item.item_type === 'pro_membership' ? 'Pro Membership' : 
                               item.item_type}
                            </TableCell>
                            <TableCell className="text-right">${item.price?.toFixed(2) || '0.00'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-sm text-muted-foreground py-4">
                            No items found
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">
                          ${selectedOrder.total_amount?.toFixed(2) || '0.00'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end">
                <Button 
                  onClick={() => setShowOrderDetails(false)} 
                  className="w-1/3"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default OrdersManagement;
