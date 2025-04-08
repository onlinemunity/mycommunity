
import React from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Users, VideoIcon, Settings, Layers } from 'lucide-react';

const AdminDashboard = () => {
  const adminCards = [
    {
      title: 'Courses',
      description: 'Manage all courses',
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      path: '/admin/courses',
      color: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Lectures',
      description: 'Manage all lectures',
      icon: <VideoIcon className="h-8 w-8 text-accent1" />,
      path: '/admin/lectures',
      color: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Users',
      description: 'Manage all users',
      icon: <Users className="h-8 w-8 text-green-600" />,
      path: '/admin/users',
      color: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Settings',
      description: 'System settings',
      icon: <Settings className="h-8 w-8 text-gray-600" />,
      path: '/admin/settings',
      color: 'bg-gray-50 dark:bg-gray-950',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Welcome to the administration area</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminCards.map((card) => (
            <Link key={card.path} to={card.path}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${card.color}`}>
                    {card.icon}
                  </div>
                  <CardTitle className="text-xl mb-1">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                <span>System Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                From here you can manage all aspects of your learning platform. Use the cards above
                to navigate to specific management areas, or use the sidebar for navigation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Link 
                  to="/admin/courses" 
                  className="bg-primary/5 hover:bg-primary/10 rounded-md p-3 text-center transition-colors"
                >
                  Add New Course
                </Link>
                <Link 
                  to="/admin/lectures" 
                  className="bg-accent1/5 hover:bg-accent1/10 rounded-md p-3 text-center transition-colors"
                >
                  Add New Lecture
                </Link>
                <Link 
                  to="/admin/users" 
                  className="bg-green-500/5 hover:bg-green-500/10 rounded-md p-3 text-center transition-colors"
                >
                  Manage Users
                </Link>
                <Link 
                  to="/admin/settings" 
                  className="bg-gray-500/5 hover:bg-gray-500/10 rounded-md p-3 text-center transition-colors"
                >
                  System Settings
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
