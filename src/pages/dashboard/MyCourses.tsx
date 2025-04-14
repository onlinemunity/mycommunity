
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CourseTable } from '@/components/dashboard/courses/CourseTable';
import { CourseTable2 } from '@/components/dashboard/courses/CourseTable2';
import { CourseOverview } from '@/components/dashboard/courses/CourseOverview';
import { LectureDetail } from '@/components/dashboard/courses/LectureDetail';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Lecture, Course } from '@/types/supabase';
import { toast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';

interface CourseData {
  id: string;
  title: string;
  description: string;
  progress: number;
  courseId: string;
  enrollmentId: string;
  lectures: Lecture[];
  video_url?: string | null;
  duration?: string;
  course_type?: string;
}

const MyCoursesPage = () => {
  const { t } = useTranslation();
  const { courseId, lectureId } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const { data: enrolledCourses, isLoading, refetch, error } = useQuery({
    queryKey: ['enrolledCourses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching enrolled courses for user:', user.id);

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
      
      if (!enrollments || enrollments.length === 0) {
        return [];
      }

      const courseIds = enrollments.map((enrollment: any) => enrollment.course_id);
      
      // Also fetch courses by href to handle course URLs
      let coursesByHref = [];
      if (courseId) {
        const { data: hrefCourses, error: hrefError } = await supabase
          .from('courses')
          .select('*')
          .eq('href', courseId)
          .limit(1);
          
        if (!hrefError && hrefCourses && hrefCourses.length > 0) {
          coursesByHref = hrefCourses;
        }
      }

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

      const progressMap = (progressData || []).reduce((acc: Record<string, boolean>, item: any) => {
        acc[item.lecture_id] = item.completed;
        return acc;
      }, {});

      const lecturesByCourse = (lecturesData || []).reduce((acc: Record<string, Lecture[]>, lecture: Lecture) => {
        if (!acc[lecture.course_id]) {
          acc[lecture.course_id] = [];
        }
        
        acc[lecture.course_id].push({
          ...lecture,
          completed: progressMap[lecture.id] || false
        });
        
        return acc;
      }, {});

      // Process enrollments
      const processedCourses = enrollments.map((enrollment: any) => {
        const courseLectures = lecturesByCourse[enrollment.course_id] || [];
        
        let finalLectures = courseLectures;
        
        if (finalLectures.length === 0) {
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
              content: `<h1>Welcome to ${courseName}</h1><p>This is an introduction to the course. You'll learn about key concepts and how to apply them.</p>`,
              full_description: null,
              material: null,
              links: null
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
              content: `<h1>Core Concepts in ${courseName}</h1><p>This lecture covers fundamental principles and important techniques.</p>`,
              full_description: null,
              material: null,
              links: null
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
              content: `This is a quiz to test your knowledge of ${courseName}.`,
              full_description: null,
              material: null,
              links: null
            }
          ];
        }
        
        const completedLectures = finalLectures.filter((l: Lecture) => l.completed).length;
        const calculatedProgress = finalLectures.length > 0 
          ? (completedLectures / finalLectures.length) * 100 
          : 0;
        
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
          lectures: finalLectures,
          video_url: enrollment.course.video_url,
          duration: enrollment.course.duration,
          course_type: enrollment.course.course_type
        } as CourseData;
      });
      
      // If a course is specified in the URL but not in enrollments, check if it exists
      if (courseId && !processedCourses.find(c => c.id === courseId) && coursesByHref.length > 0) {
        const courseFromHref = coursesByHref[0];
        
        // Check if user is enrolled in this course
        const enrollmentExists = enrollments.some((e: any) => e.course_id === courseFromHref.id);
        
        if (!enrollmentExists) {
          // User is not enrolled in this course but trying to access it
          console.log('User not enrolled in course:', courseId);
          
          // Instead of returning an array without the course, we'll add it to the 
          // processed courses array so it's available in the UI but with a not-enrolled flag
          const notEnrolledCourse = {
            id: courseFromHref.href,
            title: courseFromHref.title,
            description: courseFromHref.description,
            progress: 0,
            courseId: courseFromHref.id,
            enrollmentId: "",  // Empty as user is not enrolled
            lectures: [],
            video_url: courseFromHref.video_url,
            duration: courseFromHref.duration,
            course_type: courseFromHref.course_type,
            notEnrolled: true  // Flag to indicate user is not enrolled
          } as CourseData & { notEnrolled: boolean };
          
          processedCourses.push(notEnrolledCourse);
        }
      }
      
      return processedCourses;
    },
    enabled: !!user,
  });

  const handleCompleteLecture = async (lectureId: string) => {
    if (!courseId || !user) return;

    try {
      const courseData = enrolledCourses?.find(c => c.id === courseId);
      if (!courseData) return;

      const lecture = courseData.lectures.find((l: Lecture) => l.id === lectureId);
      if (!lecture) return;

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
              lectureId = newLectureId;
            }
          }
        } catch (err) {
          console.error('Error in lecture creation process:', err);
          return;
        }
      }

      const { data: existingProgress } = await supabase
        .from('lecture_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('lecture_id', lectureId)
        .maybeSingle();

      if (existingProgress) {
        await supabase
          .from('lecture_progress')
          .update({ completed: true, last_watched_at: new Date().toISOString() })
          .eq('id', existingProgress.id);
      } else {
        await supabase
          .from('lecture_progress')
          .insert({
            user_id: user.id,
            lecture_id: lectureId,
            completed: true,
            last_watched_at: new Date().toISOString()
          });
      }

      const updatedLectures = courseData.lectures.map((l: Lecture) => {
        if (l.id === lectureId) {
          return { ...l, completed: true };
        }
        return l;
      });
      
      const completedCount = updatedLectures.filter((l: Lecture) => l.completed).length;
      const newProgress = (completedCount / updatedLectures.length) * 100;
      
      await supabase
        .from('enrollments')
        .update({ progress: Math.round(newProgress) })
        .eq('id', courseData.enrollmentId);
      
      toast({
        title: "Progress Updated",
        description: "Your lecture has been marked as completed.",
      });
      
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

  useEffect(() => {
    console.log('Current course ID:', courseId);
    console.log('Current lecture ID:', lectureId);
    console.log('Enrolled courses:', enrolledCourses);
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to access your courses",
        variant: "destructive",
      });
      navigate('/auth?redirect=' + encodeURIComponent(window.location.pathname), { replace: true });
      return;
    }
    
    if (courseId && enrolledCourses && enrolledCourses.length > 0) {
      const selectedCourse = enrolledCourses.find(c => c.id === courseId);
      
      if (selectedCourse && (selectedCourse as any).notEnrolled) {
        toast({
          title: "Course not enrolled",
          description: "You need to enroll in this course first to access it.",
          variant: "destructive",
        });
        navigate('/courses/' + courseId, { replace: true });
        return;
      }
      
      if (!selectedCourse) {
        console.error('Course not found:', courseId);
        toast({
          title: "Course not found",
          description: "The course you're looking for couldn't be found or you're not enrolled in it.",
          variant: "destructive",
        });
        navigate('/dashboard/courses', { replace: true });
      }
    }
  }, [courseId, lectureId, enrolledCourses, navigate, user]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-accent1" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-xl font-bold mb-4">Error Loading Courses</h2>
          <p className="text-muted-foreground mb-6">There was a problem loading your courses. Please try again later.</p>
          <Button onClick={() => refetch()}>Try Again</Button>
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
              courseId: selectedCourse.courseId,
              href: courseId
            }}
            onComplete={handleCompleteLecture}
          />
        </DashboardLayout>
      );
    } else {
      return (
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-xl font-bold mb-4">Lecture Not Found</h2>
            <p className="text-muted-foreground mb-6">The lecture you're looking for couldn't be found.</p>
            <Button onClick={() => navigate(`/dashboard/courses/${courseId}`)}>
              Back to Course
            </Button>
          </div>
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
                introVideo: selectedCourse.video_url || "https://www.youtube.com/embed/dQw4w9WgXcQ",
                duration: selectedCourse.duration || "4-6 weeks",
                lectureCount: selectedCourse.lectures.length,
                progress: selectedCourse.progress,
                id: selectedCourse.id
              }} 
            />
            <div>
              <h2 className="text-xl font-semibold mb-4">{t('dashboard.courses.lecturesList')}</h2>
              <CourseTable course={selectedCourse} />
            </div>
          </div>
        </DashboardLayout>
      );
    } else {
      return (
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <h2 className="text-xl font-bold mb-4">Course Not Found</h2>
            <p className="text-muted-foreground mb-6">The course you're looking for couldn't be found or you're not enrolled in it.</p>
            <Button onClick={() => navigate('/dashboard/courses')}>
              View All Courses
            </Button>
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
        <>
          {profile?.user_type === 'basic' && (
            <div className="mb-6 p-4 border border-amber-200 bg-amber-50 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="font-medium text-amber-800">Basic Membership</h3>
                <p className="text-sm text-amber-700">You have access to basic courses only. Upgrade to premium for access to all courses.</p>
              </div>
              <Button 
                variant="outline" 
                className="bg-white text-amber-800 hover:bg-amber-100 border-amber-300"
                onClick={() => window.location.href = "/pricing"}
              >
                Upgrade to Premium
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6">
            {displayCourses.map(course => (
              <div key={course.id} className="relative">
                {course.course_type === 'premium' && (
                  <div className="absolute top-2 right-2 z-10 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-semibold flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </div>
                )}
                <CourseTable2 course={course} />
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default MyCoursesPage;
