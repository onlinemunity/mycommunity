
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Check, PackageCheck, Calendar, RefreshCw, User, CreditCard, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { Order } from '@/types/supabase';

type OrderWithUserDetails = Order & {
  user_details?: {
    username: string | null;
    full_name: string | null;
  } | null;
};

const OrdersManagement = () => {
  const [orders, setOrders] = useState<OrderWithUserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // First fetch all orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }
      
      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // For each order, get the user details separately
      const ordersWithUserDetails: OrderWithUserDetails[] = await Promise.all(
        ordersData.map(async (order) => {
          // Validate status to ensure it's a valid type
          const validatedStatus = ['pending', 'processing', 'paid', 'completed', 'cancelled'].includes(order.status) 
            ? order.status as Order['status']
            : 'pending' as const;
          
          // Validate membership_type
          const validatedMembershipType = ['basic', 'premium', 'pro'].includes(order.membership_type as string) 
            ? order.membership_type as 'basic' | 'premium' | 'pro' | null
            : null;

          // Fetch user profile details
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('username, full_name')
              .eq('id', order.user_id)
              .single();

            if (profileError) {
              console.error('Error fetching profile for user ID:', order.user_id, profileError);
              return {
                ...order,
                status: validatedStatus,
                membership_type: validatedMembershipType,
                user_details: null
              };
            }
            
            return {
              ...order,
              status: validatedStatus,
              membership_type: validatedMembershipType,
              user_details: profileData
            };
          } catch (error) {
            console.error('Unexpected error fetching profile:', error);
            return {
              ...order,
              status: validatedStatus,
              membership_type: validatedMembershipType,
              user_details: null
            };
          }
        })
      );

      setOrders(ordersWithUserDetails);
    } catch (error: any) {
      console.error('Error in fetchOrders:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to load orders. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus } 
            : order
        )
      );

      toast({
        title: 'Status Updated',
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating order status:', error.message);
      toast({
        title: 'Error',
        description: 'Failed to update order status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      !searchQuery || 
      (order.billing_name && order.billing_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.billing_email && order.billing_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user_details?.username && order.user_details.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.user_details?.full_name && order.user_details.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.id.includes(searchQuery);
    
    const matchesStatus = !statusFilter || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };

  const formatMembershipType = (type: string | null) => {
    if (!type) return "N/A";
    
    switch (type.toLowerCase()) {
      case "basic":
        return "Basic (Free)";
      case "premium":
        return "Premium";
      case "pro":
        return "Pro";
      default:
        return type;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Orders Management</h2>
          <p className="text-muted-foreground">Manage and update all customer orders</p>
        </div>
        
        <AdminNavigation />
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-8 w-full md:w-auto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={statusFilter || ''} 
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={fetchOrders} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <div>{order.billing_name || order.user_details?.full_name || 'Unknown'}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.billing_email || order.user_details?.username || 'No email'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {formatDate(order.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>${order.total_amount}</TableCell>
                      <TableCell>
                        {order.membership_type ? (
                          <Badge variant="outline" className="capitalize">
                            {formatMembershipType(order.membership_type)}
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Course Purchase
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border">
                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'pending')}>
                              Set as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'processing')}>
                              Set as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'paid')}>
                              Set as Paid
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'completed')}>
                              Set as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                              Set as Cancelled
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery || statusFilter ? 'No orders match your search criteria' : 'No orders found'}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-primary/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/20 p-2">
                    <PackageCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-500/20 p-2">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed/Paid</p>
                    <p className="text-2xl font-bold">
                      {orders.filter(o => ['completed', 'paid'].includes(o.status.toLowerCase())).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-yellow-500/20 p-2">
                    <CreditCard className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">
                      {orders.filter(o => o.status.toLowerCase() === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-500/20 p-2">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">
                      ${orders.reduce((total, order) => total + Number(order.total_amount), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default OrdersManagement;
