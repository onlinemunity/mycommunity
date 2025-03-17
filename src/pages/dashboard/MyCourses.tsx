
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
import mockLectures from '@/data/mockLectures';

const MyCoursesPage = () => {
  const { t } = useTranslation();
  const { courseId, lectureId } = useParams();
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);

  const { data: enrolledCourses, isLoading } = useQuery({
    queryKey: ['enrolledCourses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: enrollments, error } = await supabase
        .from('enrollments')
        .select(`
          id,
          progress,
          course_id,
          course:course_id(*)
        `)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching enrollments:', error);
        throw error;
      }
      
      return enrollments.map((enrollment: any) => ({
        id: enrollment.course.href,
        title: enrollment.course.title,
        description: enrollment.course.description,
        progress: enrollment.progress,
        courseId: enrollment.course_id,
        enrollmentId: enrollment.id,
        lectures: mockLectures[enrollment.course.href as keyof typeof mockLectures] || []
      }));
    },
    enabled: !!user,
  });

  const handleCompleteLecture = async (lectureId: string) => {
    if (!courseId || !user) return;

    const courseData = enrolledCourses?.find(c => c.id === courseId);
    if (!courseData) return;

    const updatedLectures = courseData.lectures.map((lecture: any) => {
      if (lecture.id === lectureId) {
        return { ...lecture, completed: true };
      }
      return lecture;
    });
    
    const completedCount = updatedLectures.filter((l: any) => l.completed).length;
    const newProgress = (completedCount / updatedLectures.length) * 100;
    
    const updatedCourses = enrolledCourses?.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          lectures: updatedLectures,
          progress: newProgress
        };
      }
      return course;
    });
    
    setCourses(updatedCourses || []);
    
    try {
      // Update progress in the database
      await supabase
        .from('enrollments')
        .update({ progress: Math.round(newProgress) })
        .eq('id', courseData.enrollmentId);
      
    } catch (error) {
      console.error('Error updating progress:', error);
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
                introVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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
