
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshCache = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: 'Cache refreshed successfully',
        description: 'All application cache has been cleared',
      });
    }, 1500);
  };

  const systemInfo = [
    { key: 'Database Status', value: 'Connected' },
    { key: 'Storage Service', value: 'Active' },
    { key: 'Authentication Service', value: 'Active' },
    { key: 'API Version', value: '1.2.0' },
    { key: 'Last Updated', value: new Date().toLocaleString() },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-muted-foreground">System configuration and status</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Current status of system components</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {systemInfo.map((item) => (
                    <TableRow key={item.key}>
                      <TableCell className="font-medium">{item.key}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5">
                          {item.value}
                          {item.key === 'Database Status' && (
                            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>Perform system maintenance tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Cache Management</h3>
                <p className="text-sm text-muted-foreground">
                  Clear application cache to ensure the latest data is displayed
                </p>
                <Button onClick={handleRefreshCache} disabled={isRefreshing}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Cache'}
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Export Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download a backup of all system data
                </p>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
