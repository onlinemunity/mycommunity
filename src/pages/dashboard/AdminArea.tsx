
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, User, Database, Settings, BarChart } from 'lucide-react';

const AdminArea = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="mb-6 text-3xl font-bold">{t('admin.adminArea')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t('admin.manageContent')}
              </CardTitle>
              <CardDescription>
                {t('admin.manageContentDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {t('admin.manageContentInfo')}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="default" asChild>
                <Link to="/dashboard/admin/manage">
                  {t('admin.manageCourses')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t('admin.manageUsers')}
              </CardTitle>
              <CardDescription>
                {t('admin.manageUsersDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {t('admin.manageUsersInfo')}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="default" asChild>
                <Link to="/dashboard/admin/manage?tab=users">
                  {t('admin.manageUsersButton')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t('admin.manageLectures')}
              </CardTitle>
              <CardDescription>
                {t('admin.manageLecturesDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {t('admin.manageLecturesInfo')}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="default" asChild>
                <Link to="/dashboard/admin/manage?tab=lectures">
                  {t('admin.manageLecturesButton')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                {t('admin.analytics')}
              </CardTitle>
              <CardDescription>
                {t('admin.analyticsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {t('admin.analyticsInfo')}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" disabled>
                {t('admin.comingSoon')}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t('admin.siteSettings')}
              </CardTitle>
              <CardDescription>
                {t('admin.siteSettingsDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {t('admin.siteSettingsInfo')}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" disabled>
                {t('admin.comingSoon')}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-lg font-semibold mb-2">{t('admin.adminInfo')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('admin.loggedInAs')}: <span className="font-medium">{profile?.full_name || profile?.username || 'Admin'}</span>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminArea;
