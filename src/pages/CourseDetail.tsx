
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { CourseContent } from '@/components/courses/CourseContent';
import { CourseHeader } from '@/components/courses/CourseHeader';
import { CourseInstructor } from '@/components/courses/CourseInstructor';
import { CourseSidebar } from '@/components/courses/CourseSidebar';
import { DiscussionBoard } from '@/components/discussion/DiscussionBoard';
import { Course } from '@/types/supabase';
import { Loader2, Lock, Star, Calendar } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('href', courseId)
        .maybeSingle();

      if (error) throw error;
      return data as Course;
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-accent1" />
        </div>
      </Layout>
    );
  }

  if (error || !course) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <p className="text-muted-foreground">The course you're looking for doesn't exist or has been removed.</p>
          <p> {course.title}   </p>
          <p> {course.href}   </p>
        </div>
      </Layout>
    );
  }

  console.log('CourseDetail - Using course ID:', course.id, 'from href:', courseId);

  const isPremiumCourse = course.course_type === 'premium';
  const userCanAccessPremium = profile?.user_type === 'yearly' || profile?.user_type === 'lifetime';
  const showPremiumWarning = isPremiumCourse && profile && !userCanAccessPremium;

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  // Get the appropriate membership type label
  const getMembershipLabel = () => {
    if (isPremiumCourse) {
      return (
        <div className="flex items-center text-amber-700 font-medium">
          <Star className="h-4 w-4 text-amber-500 mr-1" />
          Premium Course
        </div>
      );
    }
    return 'Basic Course';
  };

  return (
    <Layout>
      <div className="page-transition">
        <CourseHeader course={course} />
       
        {showPremiumWarning && (
          <div className="container-wide my-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <Lock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-amber-800">Premium Course Access</h3>
                    <p className="text-amber-700 mb-2">
                      This is a premium course. Upgrade your membership to access all content.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="bg-white/70 px-3 py-1.5 rounded-lg text-sm flex items-center">
                        <Star className="h-4 w-4 text-amber-500 mr-1.5" />
                        <span>Complete curriculum</span>
                      </div>
                      <div className="bg-white/70 px-3 py-1.5 rounded-lg text-sm flex items-center">
                        <Calendar className="h-4 w-4 text-amber-500 mr-1.5" />
                        <span>Yearly members get live events</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:flex-shrink-0">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 w-full md:w-auto"
                    onClick={handleUpgradeClick}
                  >
                    Upgrade Membership
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="container-wide py-12">
          <Tabs defaultValue="content" className="mb-8">
            <TabsList>
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 mb-8">
                  {course.video_url && (
                  <div className="aspect-video relative rounded-md overflow-hidden mb-8">
                    <iframe
                      src={course.video_url}
                      className="absolute inset-0 w-full h-full"
                      title={course.title}   
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                  )}
                
                  <CourseContent course={course} />
                  <CourseInstructor course={course} />
                </div>
                <div className="lg:col-span-1">
                  <CourseSidebar course={course} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="discussions">
              <div className="max-w-4xl mx-auto">
                <DiscussionBoard 
                  courseId={course.id}
                  title="Course Discussions"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
