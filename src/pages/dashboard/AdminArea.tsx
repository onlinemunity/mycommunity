
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserCog, Users, Shield, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminArea = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user profiles
  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const filteredProfiles = profiles?.filter(
    (profile) =>
      profile.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to get initials from name
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Sample data for recent activity
  const recentActivity = [
    {
      id: 1,
      action: 'User Joined',
      username: 'sarah.johnson',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      action: 'Role Updated',
      username: 'mark.wilson',
      timestamp: '5 hours ago',
    },
    {
      id: 3,
      action: 'Content Added',
      username: 'admin',
      timestamp: '1 day ago',
    },
    {
      id: 4,
      action: 'User Suspended',
      username: 'problematic_user',
      timestamp: '3 days ago',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('admin.title') || 'Admin Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {t('admin.subtitle') || 'Manage your community users, content, and settings'}
            </p>
          </div>
          <Button onClick={() => refetch()} className="self-start md:self-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('admin.refresh') || 'Refresh Data'}
          </Button>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              {t('admin.users') || 'Users'}
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Shield className="mr-2 h-4 w-4" />
              {t('admin.activity') || 'Activity'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>{t('admin.manageUsers') || 'Manage Users'}</CardTitle>
                    <CardDescription>
                      {t('admin.manageUsersDesc') || 'View and manage user accounts and permissions'}
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('admin.searchUsers') || 'Search users...'}
                      className="pl-8 w-full md:w-auto"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredProfiles && filteredProfiles.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium">
                      <div className="col-span-6 md:col-span-4">User</div>
                      <div className="col-span-3 md:col-span-3 hidden md:block">Username</div>
                      <div className="col-span-3 md:col-span-2 text-center">Role</div>
                      <div className="col-span-3 md:col-span-3 text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                      {filteredProfiles.map((profile) => (
                        <div key={profile.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                          <div className="col-span-6 md:col-span-4 flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={profile.avatar_url || undefined} />
                              <AvatarFallback className="bg-primary/10">
                                {getInitials(profile.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden">
                              <p className="font-medium truncate">{profile.full_name || 'No name'}</p>
                              <p className="text-xs text-muted-foreground truncate md:hidden">
                                @{profile.username || 'no_username'}
                              </p>
                            </div>
                          </div>
                          <div className="col-span-3 md:col-span-3 hidden md:block text-muted-foreground truncate">
                            @{profile.username || 'no_username'}
                          </div>
                          <div className="col-span-3 md:col-span-2 text-center">
                            <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                              {profile.role === 'admin' ? 'Admin' : 'Member'}
                            </Badge>
                          </div>
                          <div className="col-span-3 md:col-span-3 flex justify-end">
                            <Button variant="ghost" size="sm">
                              <UserCog className="h-4 w-4" />
                              <span className="ml-2 hidden md:inline">
                                {t('admin.manage') || 'Manage'}
                              </span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'No users found' : 'No users available'}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.recentActivity') || 'Recent Activity'}</CardTitle>
                <CardDescription>
                  {t('admin.recentActivityDesc') || 'Monitor recent actions and events in your community'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium">
                    <div className="col-span-5">Action</div>
                    <div className="col-span-4">User</div>
                    <div className="col-span-3 text-right">Time</div>
                  </div>
                  <div className="divide-y">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                        <div className="col-span-5">
                          <Badge variant="outline">{activity.action}</Badge>
                        </div>
                        <div className="col-span-4 text-muted-foreground">
                          @{activity.username}
                        </div>
                        <div className="col-span-3 text-right text-sm text-muted-foreground">
                          {activity.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminArea;
