import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { CourseContent } from '@/components/courses/CourseContent';
import { CourseHeader } from '@/components/courses/CourseHeader';
import { CourseInstructor } from '@/components/courses/CourseInstructor';
import { CourseSidebar } from '@/components/courses/CourseSidebar';
import { DiscussionBoard } from '@/components/discussion/DiscussionBoard';
import { Course, Lecture } from '@/types/supabase';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface CourseVideoProps {
  course: Course;
  lecture: Lecture;
}

const CourseVideo = ({ course, lecture }: CourseVideoProps) => {
  return (
    <Layout>
      <div className="page-transition">
        <CourseHeader course={course} />
        
        <div className="container-wide py-12">
          <Tabs defaultValue="content" className="mb-8">
            <TabsList>
              <TabsTrigger value="content">Lecture Content</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2 mb-8">
                  {lecture.video_url && (
                  <div className="aspect-video relative rounded-md overflow-hidden mb-8">
                    <iframe
                      src={lecture.video_url}
                      className="absolute inset-0 w-full h-full"
                      title={lecture.title}   
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
                  lectureId={lecture.id}
                  title="Lecture Discussions"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CourseVideo;
