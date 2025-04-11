
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { CourseHeader } from '@/components/courses/CourseHeader';
import { CourseContent } from '@/components/courses/CourseContent';
import { CourseSidebar } from '@/components/courses/CourseSidebar';
import { CourseInstructor } from '@/components/courses/CourseInstructor';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Course } from '@/types/supabase';
import { toast } from '@/components/ui/use-toast';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      console.log("Fetching course with href:", id);
      
      // Try to fetch by href first (most common case)
      const { data: courseByHref, error: hrefError } = await supabase
        .from('courses')
        .select('*')
        .eq('href', id)
        .maybeSingle();
      
      if (courseByHref) {
        console.log("Found course by href:", courseByHref);
        return courseByHref;
      }
      
      // If not found by href, try by uuid (fallback)
      const { data: courseById, error: idError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (courseById) {
        console.log("Found course by id:", courseById);
        return courseById;
      }
      
      // If not found by either method, throw error
      if (!courseByHref && !courseById) {
        console.error("Course not found for id/href:", id);
        console.error("Href error:", hrefError);
        console.error("ID error:", idError);
        throw new Error("Course not found");
      }
    },
  });

  // Transform the fetched data to match the Course type
  const course: Course | undefined = courseData ? {
    ...courseData,
    // Make sure level is one of the expected string literals
    level: (courseData.level?.toLowerCase() as "beginner" | "intermediate" | "advanced") || "beginner"
  } : undefined;

  useEffect(() => {
    if (error) {
      console.error('Error fetching course:', error);
      toast({
        title: "Course not found",
        description: "The requested course could not be found.",
        variant: "destructive"
      });
      navigate('/not-found', { replace: true });
    }
  }, [error, navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-accent1" />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return null; // Will be handled by the useEffect above
  }

  return (
    <Layout>
      <div className="page-transition">
        <CourseHeader course={course} />
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" onValueChange={handleTabChange}>
                <TabsList className="mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="content">Course Content</TabsTrigger>
                  <TabsTrigger value="instructor">Instructor</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-0">
                  <CourseContent course={course} />
                </TabsContent>
                <TabsContent value="content" className="p-0">
                  <CourseContent course={course} showContent />
                </TabsContent>
                <TabsContent value="instructor" className="p-0">
                  <CourseInstructor course={course} />
                </TabsContent>
              </Tabs>
            </div>
            <div className="col-span-1">
              <CourseSidebar course={course} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
