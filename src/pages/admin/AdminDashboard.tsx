
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, UsersRound, BookOpen, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalLectures: 0,
    totalEnrollments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get total courses
        const { count: coursesCount } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });

        // Get total lectures
        const { count: lecturesCount } = await supabase
          .from('lectures')
          .select('*', { count: 'exact', head: true });

        // Get total enrollments
        const { count: enrollmentsCount } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalUsers: usersCount || 0,
          totalCourses: coursesCount || 0,
          totalLectures: lecturesCount || 0,
          totalEnrollments: enrollmentsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <UsersRound className="h-6 w-6 text-blue-500" />,
      description: 'Registered users',
      color: 'bg-blue-50'
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      description: 'Available courses',
      color: 'bg-green-50'
    },
    {
      title: 'Total Lectures',
      value: stats.totalLectures,
      icon: <Video className="h-6 w-6 text-purple-500" />,
      description: 'All lectures',
      color: 'bg-purple-50'
    },
    {
      title: 'Total Enrollments',
      value: stats.totalEnrollments,
      icon: <BarChart className="h-6 w-6 text-orange-500" />,
      description: 'Course enrollments',
      color: 'bg-orange-50'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your platform's key metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <Card key={card.title} className="overflow-hidden">
              <CardHeader className={`${card.color} p-4`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-3xl font-bold">{card.value}</div>
                <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
