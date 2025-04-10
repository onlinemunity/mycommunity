import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { CourseContent } from '@/components/courses/CourseContent';
import { CourseHeader } from '@/components/courses/CourseHeader';
import { CourseInstructor } from '@/components/courses/CourseInstructor';
import { CourseSidebar } from '@/components/courses/CourseSidebar';
import { DiscussionBoard } from '@/components/discussion/DiscussionBoard';
import { Course } from '@/types/supabase';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/auth';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CourseDetail = () => {
  const { courseId } = useParams();
  const { profile } = useAuth(); 

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('href', courseId)
        .single();

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
        </div>
      </Layout>
    );
  }

  console.log('CourseDetail - Using course ID:', course.id, 'from href:', courseId);

  const isPremiumCourse = course.course_type === 'premium';
  const userCanAccessPremium = profile?.user_type === 'premium';
  const showPremiumWarning = isPremiumCourse && profile && !userCanAccessPremium;

  return (
    <Layout>
      <div className="page-transition">
        <CourseHeader course={course} />
       
        {showPremiumWarning && (
          <div className="container-wide my-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-amber-600 mr-3" />
                <div>
                  <h3 className="font-medium text-amber-800">Premium Course</h3>
                  <p className="text-sm text-amber-700">This is a premium course. Upgrade your membership to enroll.</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="bg-white text-amber-800 hover:bg-amber-100 border-amber-300"
                onClick={() => window.location.href = "/pricing"}
              >
                Upgrade to Premium
              </Button>
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
