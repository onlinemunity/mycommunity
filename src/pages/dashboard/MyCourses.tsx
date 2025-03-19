
import React, { useState, useEffect } from 'react';
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
  const { data: enrolledCourses, isLoading, refetch } = useQuery({
    queryKey: ['enrolledCourses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching enrolled courses for user:', user.id);
      
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

      console.log('Enrollments fetched:', enrollments);

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

      console.log('Lectures fetched:', lecturesData);

      // Fetch user's lecture progress
      const { data: progressData, error: progressError } = await supabase
        .from('lecture_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('lecture_id', lecturesData?.map((l: Lecture) => l.id) || []);
      
      if (progressError) {
        console.error('Error fetching lecture progress:', progressError);
        // Continue without progress data if there's an error
      }

      console.log('Progress data fetched:', progressData);

      // Create a map of lecture progress
      const progressMap = (progressData || []).reduce((acc: Record<string, boolean>, item: any) => {
        acc[item.lecture_id] = item.completed;
        return acc;
      }, {});

      // Group lectures by course
      const lecturesByCourse = (lecturesData || []).reduce((acc: Record<string, Lecture[]>, lecture: Lecture) => {
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

      console.log('Lectures by course:', lecturesByCourse);

      // Add lectures to each course
      return enrollments.map((enrollment: any) => {
        // Get lectures for this course
        const courseLectures = lecturesByCourse[enrollment.course_id] || [];
        
        // If there are no database lectures, only then create sample lectures
        let finalLectures = courseLectures;
        
        if (finalLectures.length === 0) {
          // Generate sample lectures based on course name and content
          const courseName = enrollment.course.title;
          finalLectures = [
            {
              id: `${enrollment.course_id}-lecture-1`,
              title: `Introduction to ${courseName}`,
              duration: '15:30',
              completed: false,
              sort_order: 1,
              course_id: enrollment.course_id,
              video_url: 'https://youtube.com/embed/LCytZwzxyrY',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              description: `Welcome to ${courseName}! In this lecture, we will go over the course outline.`,
              content: `<h1>Welcome to ${courseName}</h1><p>This is an introduction to the course. You'll learn about key concepts and how to apply them.</p>`
            },
            {
              id: `${enrollment.course_id}-lecture-2`,
              title: `${courseName} - Core Concepts`,
              duration: '20:45',
              completed: false,
              sort_order: 2,
              course_id: enrollment.course_id,
              video_url: 'https://youtube.com/embed/bKP__MRJd_8',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              description: `Learn the fundamental concepts of ${courseName}.`,
              content: `<h1>Core Concepts in ${courseName}</h1><p>This lecture covers fundamental principles and important techniques.</p>`
            },
            {
              id: `${enrollment.course_id}-lecture-3`,
              title: `Quiz: ${courseName} Fundamentals`,
              duration: '10 mins',
              completed: false,
              sort_order: 3,
              course_id: enrollment.course_id,
              video_url: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              description: `Test your understanding of ${courseName} core concepts.`,
              content: `This is a quiz to test your knowledge of ${courseName}.`
            }
          ];
        }
        
        // Calculate the actual progress based on completed lectures
        const completedLectures = finalLectures.filter((l: Lecture) => l.completed).length;
        const calculatedProgress = finalLectures.length > 0 
          ? (completedLectures / finalLectures.length) * 100 
          : 0;
        
        // Use the calculated progress if there are lectures, otherwise use the saved progress
        const finalProgress = finalLectures.length > 0 
          ? calculatedProgress 
          : enrollment.progress;
        
        return {
          id: enrollment.course.href,
          title: enrollment.course.title,
          description: enrollment.course.description,
          progress: finalProgress,
          courseId: enrollment.course_id,
          enrollmentId: enrollment.id,
          lectures: finalLectures
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

      // If lecture is a sample lecture (generated on frontend), create it in database
      const isSampleLecture = typeof lectureId === 'string' && lectureId.startsWith(courseData.courseId);
      
      if (isSampleLecture) {
        console.log('Creating sample lecture in database:', lecture);
        
        try {
          const { data: existingLecture, error: checkError } = await supabase
            .from('lectures')
            .select('id')
            .eq('id', lectureId)
            .maybeSingle();
            
          if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking lecture:', checkError);
          }
            
          if (!existingLecture) {
            // Create a proper UUID for the new lecture
            const newLectureId = crypto.randomUUID();
            
            const { data, error } = await supabase
              .from('lectures')
              .insert({
                id: newLectureId,
                title: lecture.title,
                description: lecture.description,
                content: lecture.content,
                duration: lecture.duration,
                video_url: lecture.video_url,
                course_id: lecture.course_id,
                sort_order: lecture.sort_order,
              });
                
            if (error) {
              console.error('Error creating lecture:', error);
              toast({
                title: "Error creating lecture",
                description: error.message,
                variant: "destructive",
              });
              return;
            } else {
              console.log('Lecture created successfully with ID:', newLectureId);
              // Update the lectureId to the new UUID
              lectureId = newLectureId;
            }
          }
        } catch (err) {
          console.error('Error in lecture creation process:', err);
          return;
        }
      }

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
            completed: true,
            last_watched_at: new Date().toISOString()
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
      
      toast({
        title: "Progress Updated",
        description: "Your lecture has been marked as completed.",
      });
      
      // Refetch data to update UI
      refetch();
      
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error updating progress",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Debug
  useEffect(() => {
    console.log('Current course ID:', courseId);
    console.log('Current lecture ID:', lectureId);
    console.log('Enrolled courses:', enrolledCourses);
  }, [courseId, lectureId, enrolledCourses]);

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
