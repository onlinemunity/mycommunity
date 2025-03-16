
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MemberArea = () => {
  const { t } = useTranslation();

  // Sample data for member events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Introduction to Web Development',
      type: 'Workshop',
      date: 'June 15, 2023',
      time: '6:00 PM - 8:00 PM',
      participants: 24,
    },
    {
      id: 2,
      title: 'Advanced CSS Techniques',
      type: 'Webinar',
      date: 'June 22, 2023',
      time: '5:30 PM - 7:00 PM',
      participants: 56,
    },
    {
      id: 3,
      title: 'Monthly Community Meetup',
      type: 'Networking',
      date: 'June 30, 2023',
      time: '7:00 PM - 9:00 PM',
      participants: 42,
    },
  ];

  // Sample data for exclusive resources
  const exclusiveResources = [
    {
      id: 1,
      title: 'Complete React Architecture Guide',
      type: 'E-Book',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: 2,
      title: 'UI/UX Design Principles Workshop',
      type: 'Video Course',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: 3,
      title: 'Community Design System',
      type: 'Resource Kit',
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];

  // Sample data for discussion groups
  const discussionGroups = [
    {
      id: 1,
      name: 'Frontend Development',
      members: 145,
      posts: 423,
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      id: 2,
      name: 'UI/UX Design',
      members: 98,
      posts: 256,
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      id: 3,
      name: 'Career Development',
      members: 210,
      posts: 512,
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('member.title') || 'Member Area'}</h1>
          <p className="text-muted-foreground">
            {t('member.subtitle') || 'Access exclusive member content and resources'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t('member.events') || 'Upcoming Events'}</CardTitle>
              <CardDescription>
                {t('member.eventsDesc') || 'Exclusive events for members'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge variant="secondary">{event.type}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{event.participants} participants</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                {t('member.viewAllEvents') || 'View All Events'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t('member.resources') || 'Exclusive Resources'}</CardTitle>
              <CardDescription>
                {t('member.resourcesDesc') || 'Premium content for our members'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exclusiveResources.map((resource) => (
                  <div key={resource.id} className="flex items-start space-x-3 border-b pb-4 last:border-0 last:pb-0">
                    <div className="mt-0.5 bg-primary/10 p-2 rounded-md">
                      {resource.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.type}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                {t('member.viewAllResources') || 'View All Resources'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{t('member.discussions') || 'Member Discussions'}</CardTitle>
              <CardDescription>
                {t('member.discussionsDesc') || 'Join conversations with other members'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discussionGroups.map((group) => (
                  <div key={group.id} className="flex items-start space-x-3 border-b pb-4 last:border-0 last:pb-0">
                    <div className="mt-0.5 bg-primary/10 p-2 rounded-md">
                      {group.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      <div className="flex items-center text-xs text-muted-foreground space-x-2">
                        <span>{group.members} members</span>
                        <span>•</span>
                        <span>{group.posts} posts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                {t('member.viewAllDiscussions') || 'View All Discussions'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberArea;
