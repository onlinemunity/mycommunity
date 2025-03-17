import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CourseTable } from '@/components/dashboard/courses/CourseTable';
import { CourseOverview } from '@/components/dashboard/courses/CourseOverview';
import { LectureDetail } from '@/components/dashboard/courses/LectureDetail';
import { useTranslation } from '@/hooks/useTranslation';

// Mock data - in a real app this would come from your API/database
const MOCK_COURSES = [
  {
    id: 'react-fundamentals',
    title: 'React Fundamentals',
    description: 'Learn the fundamentals of React and build modern web applications',
    introVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '6 hours',
    lectureCount: 12,
    progress: 25,
    lectures: [
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
    ]
  },
  {
    id: 'advanced-css',
    title: 'Advanced CSS Techniques',
    description: 'Master modern CSS techniques and responsive design patterns',
    introVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '4.5 hours',
    lectureCount: 8,
    progress: 50,
    lectures: [
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
  }
];

const MyCoursesPage = () => {
  const { t } = useTranslation();
  const { courseId, lectureId } = useParams();
  const [courses, setCourses] = useState(MOCK_COURSES);

  const selectedCourse = courseId 
    ? courses.find(c => c.id === courseId) 
    : null;

  const selectedLecture = lectureId && selectedCourse 
    ? selectedCourse.lectures.find(l => l.id === lectureId) 
    : null;

  const handleCompleteLecture = (lectureId: string) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        // If this isn't the current course, return it unchanged
        if (course.id !== courseId) return course;
        
        // Find the lecture and mark it complete
        const updatedLectures = course.lectures.map(lecture => {
          if (lecture.id === lectureId) {
            return { ...lecture, completed: true };
          }
          return lecture;
        });
        
        // Calculate new progress
        const completedCount = updatedLectures.filter(l => l.completed).length;
        const progress = (completedCount / updatedLectures.length) * 100;
        
        return {
          ...course,
          lectures: updatedLectures,
          progress
        };
      });
    });
  };

  // Render lecture detail if we have both courseId and lectureId
  if (courseId && lectureId && selectedCourse && selectedLecture) {
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

  // Render course overview if we have courseId
  if (courseId && selectedCourse) {
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

  // Render list of all courses
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.courses.title')}</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {courses.map(course => (
          <CourseTable key={course.id} course={course} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default MyCoursesPage;
