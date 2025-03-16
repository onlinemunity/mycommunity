
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, BookOpen, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const stats = [
    {
      title: t('dashboard.stats.members') || 'Community Members',
      value: '2,500+',
      icon: <Users className="h-5 w-5 text-accent1" />,
      description: t('dashboard.stats.membersDesc') || 'Active members in our community',
    },
    {
      title: t('dashboard.stats.courses') || 'Available Courses',
      value: '120+',
      icon: <BookOpen className="h-5 w-5 text-accent1" />,
      description: t('dashboard.stats.coursesDesc') || 'Courses and learning materials',
    },
    {
      title: t('dashboard.stats.events') || 'Upcoming Events',
      value: '8',
      icon: <Calendar className="h-5 w-5 text-accent1" />,
      description: t('dashboard.stats.eventsDesc') || 'Events scheduled this month',
    },
    {
      title: t('dashboard.stats.activity') || 'Daily Activity',
      value: '150+',
      icon: <Activity className="h-5 w-5 text-accent1" />,
      description: t('dashboard.stats.activityDesc') || 'Posts and interactions per day',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('dashboard.welcome') || 'Welcome'}, {profile?.full_name || profile?.username || ''}!
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.overview') || 'Here\'s an overview of your community dashboard'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivity') || 'Recent Activity'}</CardTitle>
              <CardDescription>
                {t('dashboard.recentActivityDesc') || 'Your recent interactions and updates'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-accent1 mr-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">
                        {t('dashboard.activityItem') || 'New course recommendation based on your interests'}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">2h ago</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.upcomingEvents') || 'Upcoming Events'}</CardTitle>
              <CardDescription>
                {t('dashboard.upcomingEventsDesc') || 'Events you might be interested in'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-accent1" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t('dashboard.eventTitle') || 'Community Webinar: Advanced Techniques'}
                      </p>
                      <p className="text-xs text-muted-foreground">Jun 20, 2023 · 3:00 PM</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
