
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Shield, ShieldOff } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Profile } from '@/types/supabase';

const UsersManagement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    avatar_url: '',
    role: '',
  });

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: typeof formData & { id: string }) => {
      const { id, ...profileData } = userData;
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: t('admin.userUpdated'),
        description: t('admin.userUpdatedDesc'),
      });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.errorUpdatingUser'),
        variant: 'destructive',
      });
    },
  });

  // Toggle admin role mutation
  const toggleAdminRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: variables.role === 'admin' 
          ? t('admin.promotedToAdmin')
          : t('admin.removedAdminRole'),
        description: t('admin.roleUpdateDesc'),
      });
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.errorUpdatingRole'),
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateUserMutation.mutate({
        ...formData,
        id: selectedUser.id,
      });
    }
  };

  const handleToggleAdminRole = (user: Profile) => {
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    toggleAdminRoleMutation.mutate({ id: user.id, role: newRole });
  };

  const handleEdit = (user: Profile) => {
    setSelectedUser(user);
    setFormData({
      full_name: user.full_name || '',
      username: user.username || '',
      avatar_url: user.avatar_url || '',
      role: user.role || 'member',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{t('admin.usersManagement')}</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin text-accent1" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.user')}</TableHead>
                <TableHead>{t('admin.username')}</TableHead>
                <TableHead>{t('admin.role')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <img 
                            src={user.avatar_url || '/placeholder.svg'} 
                            alt={user.full_name || ''} 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </Avatar>
                        <span className="font-medium">{user.full_name || 'Unnamed User'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.username || '-'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role || 'member'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant={user.role === 'admin' ? 'destructive' : 'outline'} 
                          size="sm" 
                          onClick={() => handleToggleAdminRole(user)}
                        >
                          {user.role === 'admin' ? (
                            <ShieldOff className="h-4 w-4" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    {t('admin.noUsers')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.editUser')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">{t('admin.fullName')}</Label>
                <Input 
                  id="full_name" 
                  name="full_name" 
                  value={formData.full_name} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">{t('admin.username')}</Label>
                <Input 
                  id="username" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">{t('admin.avatarUrl')}</Label>
                <Input 
                  id="avatar_url" 
                  name="avatar_url" 
                  value={formData.avatar_url} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t('admin.role')}</Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t('admin.cancel')}
                </Button>
                <Button type="submit">
                  {t('admin.update')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
