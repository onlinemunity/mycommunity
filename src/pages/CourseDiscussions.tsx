
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { DiscussionBoard } from '@/components/discussion/DiscussionBoard';

const CourseDiscussions = () => {
  const { courseId } = useParams();
  
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      // First get the course by href
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('href', courseId)
        .single();

      if (error) throw error;
      console.log('CourseDiscussions - Found course:', data);
      return data;
    },
  });
  
  useEffect(() => {
    if (course) {
      console.log('CourseDiscussions - Using course ID:', course.id, 'from href:', courseId);
    }
  }, [course, courseId]);

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
        <div className="container py-12">
          <h1 className="text-2xl font-bold">Course not found</h1>
          <p>{error?.message || 'The requested course could not be found.'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-muted-foreground">Community Discussions</p>
        </div>
        
        {course && course.id && (
          <DiscussionBoard 
            courseId={course.id}
            title="Course Discussions"
          />
        )}
      </div>
    </Layout>
  );
};

export default CourseDiscussions;
