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

const MOCK_LECTURES = {
  'react-fundamentals': [
    {
      id: 'lecture-1',
      title: 'Introduction to React',
      duration: '15 min',
      completed: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: '<p>React is a JavaScript library for building user interfaces.</p><p>It was developed by Facebook and is widely used in modern web development.</p>',
      description: 'Learn the basics of React and its core concepts',
      quiz: [
        {
          id: 'quiz-1-1',
          question: 'Who developed React?',
          options: [
            { id: 'opt-1', text: 'Google' },
            { id: 'opt-2', text: 'Facebook' },
            { id: 'opt-3', text: 'Microsoft' },
            { id: 'opt-4', text: 'Amazon' }
          ],
          correctOptionId: 'opt-2'
        },
        {
          id: 'quiz-1-2',
          question: 'React is a _____?',
          options: [
            { id: 'opt-1', text: 'Programming language' },
            { id: 'opt-2', text: 'Framework' },
            { id: 'opt-3', text: 'Library' },
            { id: 'opt-4', text: 'Database' }
          ],
          correctOptionId: 'opt-3'
        }
      ]
    },
    {
      id: 'lecture-2',
      title: 'Components and Props',
      duration: '25 min',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: '<p>Components are the building blocks of React applications.</p><p>Props are how we pass data between components.</p>',
      description: 'Understanding React components and how to use props',
      quiz: [
        {
          id: 'quiz-2-1',
          question: 'What are the building blocks of React applications?',
          options: [
            { id: 'opt-1', text: 'Functions' },
            { id: 'opt-2', text: 'Components' },
            { id: 'opt-3', text: 'Classes' },
            { id: 'opt-4', text: 'Objects' }
          ],
          correctOptionId: 'opt-2'
        }
      ]
    },
    {
      id: 'lecture-3',
      title: 'State and Lifecycle',
      duration: '30 min',
      completed: false,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: '<p>State is a way to store and manage component-specific data.</p><p>React components have lifecycle methods that let you run code at specific times.</p>',
      description: 'Learn about React state and component lifecycle',
      quiz: [
        {
          id: 'quiz-3-1',
          question: 'What hook is used to add state to a functional component?',
          options: [
            { id: 'opt-1', text: 'useEffect' },
            { id: 'opt-2', text: 'useState' },
            { id: 'opt-3', text: 'useContext' },
            { id: 'opt-4', text: 'useReducer' }
          ],
          correctOptionId: 'opt-2'
        }
      ]
    }
  ],
  'advanced-css': [
    {
      id: 'lecture-1',
      title: 'Flexbox Layout',
      duration: '20 min',
      completed: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: '<p>Flexbox is a one-dimensional layout method for arranging items in rows or columns.</p>',
      description: 'Learn how to use Flexbox for modern layouts',
      quiz: [
        {
          id: 'quiz-1-1',
          question: 'Flexbox is a _____-dimensional layout method',
          options: [
            { id: 'opt-1', text: 'One' },
            { id: 'opt-2', text: 'Two' },
            { id: 'opt-3', text: 'Three' },
            { id: 'opt-4', text: 'Multi' }
          ],
          correctOptionId: 'opt-1'
        }
      ]
    },
    {
      id: 'lecture-2',
      title: 'CSS Grid',
      duration: '25 min',
      completed: true,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      content: '<p>CSS Grid is a two-dimensional layout system designed for complex layouts.</p>',
      description: 'Master CSS Grid for complex layouts',
      quiz: [
        {
          id: 'quiz-2-1',
          question: 'CSS Grid is a _____-dimensional layout method',
          options: [
            { id: 'opt-1', text: 'One' },
            { id: 'opt-2', text: 'Two' },
            { id: 'opt-3', text: 'Three' },
            { id: 'opt-4', text: 'Multi' }
          ],
          correctOptionId: 'opt-2'
        }
      ]
    }
  ]
};

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
          courses:course_id(*)
        `)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching enrollments:', error);
        throw error;
      }
      
      return enrollments.map(enrollment => ({
        id: enrollment.courses.href,
        title: enrollment.courses.title,
        description: enrollment.courses.description,
        progress: enrollment.progress,
        lectures: MOCK_LECTURES[enrollment.courses.href as keyof typeof MOCK_LECTURES] || []
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
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseData.course_id)
        .single();
      
      if (enrollment) {
        await supabase
          .from('enrollments')
          .update({ progress: Math.round(newProgress) })
          .eq('id', enrollment.id);
      }
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
            <CourseOverview course={selectedCourse} />
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
