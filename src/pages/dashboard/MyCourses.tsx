
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CourseTable } from '@/components/dashboard/courses/CourseTable';
import { CourseOverview } from '@/components/dashboard/courses/CourseOverview';
import { LectureDetail } from '@/components/dashboard/courses/LectureDetail';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Lecture } from '@/types/supabase';
import { toast } from '@/components/ui/use-toast';

const MyCoursesPage = () => {
  const { t } = useTranslation();
  const { courseId, lectureId } = useParams();
  const { user } = useAuth();

  // Fetch enrolled courses with lectures
  const { data: enrolledCourses, isLoading } = useQuery({
    queryKey: ['enrolledCourses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Fetch enrollments with course data
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress,
          course_id,
          course:courses(*)
        `)
        .eq('user_id', user.id);
      
      if (enrollmentsError) {
        console.error('Error fetching enrollments:', enrollmentsError);
        throw enrollmentsError;
      }

      // Create a map of course IDs for enrolled courses
      const courseIds = enrollments.map((enrollment: any) => enrollment.course_id);
      
      if (courseIds.length === 0) {
        return [];
      }

      // Fetch lectures for all enrolled courses
      const { data: lecturesData, error: lecturesError } = await supabase
        .from('lectures')
        .select('*')
        .in('course_id', courseIds)
        .order('sort_order', { ascending: true });
      
      if (lecturesError) {
        console.error('Error fetching lectures:', lecturesError);
        throw lecturesError;
      }

      // Fetch user's lecture progress
      const { data: progressData, error: progressError } = await supabase
        .from('lecture_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('lecture_id', lecturesData.map((l: Lecture) => l.id));
      
      if (progressError) {
        console.error('Error fetching lecture progress:', progressError);
        // Continue without progress data if there's an error
      }

      // Create a map of lecture progress
      const progressMap = (progressData || []).reduce((acc: Record<string, boolean>, item: any) => {
        acc[item.lecture_id] = item.completed;
        return acc;
      }, {});

      // Group lectures by course
      const lecturesByCourse = lecturesData.reduce((acc: Record<string, Lecture[]>, lecture: Lecture) => {
        if (!acc[lecture.course_id]) {
          acc[lecture.course_id] = [];
        }
        
        // Add completed status to each lecture based on progress data
        acc[lecture.course_id].push({
          ...lecture,
          completed: progressMap[lecture.id] || false
        });
        
        return acc;
      }, {});

      // Add lectures to each course
      return enrollments.map((enrollment: any) => {
        const courseLectures = lecturesByCourse[enrollment.course_id] || [];
        const completedLectures = courseLectures.filter((l: Lecture) => l.completed).length;
        const progress = courseLectures.length > 0 
          ? (completedLectures / courseLectures.length) * 100 
          : enrollment.progress;
        
        return {
          id: enrollment.course.href,
          title: enrollment.course.title,
          description: enrollment.course.description,
          progress: progress,
          courseId: enrollment.course_id,
          enrollmentId: enrollment.id,
          lectures: courseLectures
        };
      });
    },
    enabled: !!user,
  });

  const handleCompleteLecture = async (lectureId: string) => {
    if (!courseId || !user) return;

    try {
      // Find the current course and lecture
      const courseData = enrolledCourses?.find(c => c.id === courseId);
      if (!courseData) return;

      const lecture = courseData.lectures.find((l: Lecture) => l.id === lectureId);
      if (!lecture) return;

      // Check if there's already a progress record
      const { data: existingProgress } = await supabase
        .from('lecture_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lecture_id', lectureId)
        .maybeSingle();

      if (existingProgress) {
        // Update existing progress
        await supabase
          .from('lecture_progress')
          .update({ completed: true, last_watched_at: new Date().toISOString() })
          .eq('id', existingProgress.id);
      } else {
        // Create new progress record
        await supabase
          .from('lecture_progress')
          .insert({
            user_id: user.id,
            lecture_id: lectureId,
            completed: true
          });
      }

      // Calculate new course progress
      const updatedLectures = courseData.lectures.map((l: Lecture) => {
        if (l.id === lectureId) {
          return { ...l, completed: true };
        }
        return l;
      });
      
      const completedCount = updatedLectures.filter((l: Lecture) => l.completed).length;
      const newProgress = (completedCount / updatedLectures.length) * 100;
      
      // Update enrollment progress
      await supabase
        .from('enrollments')
        .update({ progress: Math.round(newProgress) })
        .eq('id', courseData.enrollmentId);
      
      // Force refetch data
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-accent1" />
        </div>
      </DashboardLayout>
    );
  }

  const displayCourses = enrolledCourses || [];

  if (courseId && lectureId) {
    const selectedCourse = displayCourses.find(c => c.id === courseId);
    const selectedLecture = selectedCourse?.lectures.find((l: any) => l.id === lectureId);
    
    if (selectedCourse && selectedLecture) {
      return (
        <DashboardLayout>
          <h1 className="text-2xl font-bold mb-6">{t('dashboard.courses.title')}</h1>
          <LectureDetail 
            lecture={{
              ...selectedLecture,
              courseId
            }}
            onComplete={handleCompleteLecture}
          />
        </DashboardLayout>
      );
    }
  }

  if (courseId) {
    const selectedCourse = displayCourses.find(c => c.id === courseId);
    if (selectedCourse) {
      return (
        <DashboardLayout>
          <h1 className="text-2xl font-bold mb-6">{t('dashboard.courses.title')}</h1>
          <div className="space-y-8">
            <CourseOverview 
              course={{
                title: selectedCourse.title,
                description: selectedCourse.description,
                introVideo: selectedCourse.lectures[0]?.video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ",
                duration: "4-6 weeks",
                lectureCount: selectedCourse.lectures.length,
                progress: selectedCourse.progress
              }} 
            />
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('dashboard.courses.lecturesList')}</h2>
              <CourseTable course={selectedCourse} />
            </div>
          </div>
        </DashboardLayout>
      );
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.courses.title')}</h1>
      
      {displayCourses.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-2">You haven't enrolled in any courses yet</h2>
          <p className="text-muted-foreground mb-6">Explore our catalog and enroll in a course to get started</p>
          <Button onClick={() => window.location.href = "/courses"}>
            Browse Courses
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {displayCourses.map(course => (
            <CourseTable key={course.id} course={course} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyCoursesPage;
