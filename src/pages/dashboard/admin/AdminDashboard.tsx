
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import CoursesManagement from '@/components/dashboard/admin/CoursesManagement';
import LecturesManagement from '@/components/dashboard/admin/LecturesManagement';
import UsersManagement from '@/components/dashboard/admin/UsersManagement';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent1" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-xl font-semibold">{t('admin.accessDenied')}</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="mb-6 text-3xl font-bold">{t('admin.dashboard')}</h1>
        
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="courses">{t('admin.courses')}</TabsTrigger>
            <TabsTrigger value="lectures">{t('admin.lectures')}</TabsTrigger>
            <TabsTrigger value="users">{t('admin.users')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="courses">
            <CoursesManagement />
          </TabsContent>
          
          <TabsContent value="lectures">
            <LecturesManagement />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
