
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

const CourseDetail = () => {
  const { courseId } = useParams();

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

  return (
    <Layout>
      <div className="page-transition">
        <CourseHeader course={course} />
       
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
