
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { DiscussionBoard } from '@/components/discussion/DiscussionBoard';

type LectureDetailProps = {
  lecture: {
    id: string;
    title?: string;
    description?: string;
    material?: string;
    video_url?: string;
    content?: string;
    links?: string;
    courseId: string;
    href: string;
    completed?: boolean;
  };
  onComplete: (lectureId: string) => void;
};

export const LectureDetail = ({ lecture, onComplete }: LectureDetailProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('LectureDetail component with lecture ID:', lecture.id, 'and course ID:', lecture.courseId, 'and href:', lecture.href);
  }, [lecture.id, lecture.courseId, lecture.href]);
  
  const { data: lectureData, isLoading } = useQuery({
    queryKey: ['lecture', lecture.id],
    queryFn: async () => {
      if (lecture.title && lecture.content) {
        return lecture;
      }
      
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('id', lecture.id)
        .single();
      
      if (error) throw error;
      return { ...data, courseId: lecture.courseId, completed: lecture.completed };
    },
  });
  
  const { data: siblingLectures, isLoading: isLoadingSiblings } = useQuery({
    queryKey: ['course-lectures', lecture.courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lectures')
        .select('id, title, sort_order')
        .eq('course_id', lecture.courseId)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
  
  const currentIndex = siblingLectures?.findIndex(l => l.id === lecture.id) || 0;
  const prevLecture = siblingLectures && currentIndex > 0 ? siblingLectures[currentIndex - 1] : null;
  const nextLecture = siblingLectures && currentIndex < siblingLectures.length - 1 ? siblingLectures[currentIndex + 1] : null;
  
  const handleNavigate = (lectureId: string) => {
    navigate(`/dashboard/courses/${lecture.href}/lecture/${lectureId}`);
  };
  
  const renderVideoOrContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-accent1" />
        </div>
      );
    }
    
    if (!lectureData) {
      return <div>Lecture not found</div>;
    }
    
    return (
      <div className="space-y-6">
        {lectureData.video_url ? (
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <iframe
              src={lectureData.video_url}
              className="absolute inset-0 w-full h-full"
              title={lectureData.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="bg-muted rounded-lg p-8 text-center text-muted-foreground">
            No video available for this lecture
          </div>
        )}
        
        <div className="prose prose-stone dark:prose-invert max-w-none">
          {lectureData.content ? (
            <div dangerouslySetInnerHTML={{ __html: lectureData.content }} />
          ) : lectureData.description ? (
            <p>{lectureData.description}</p>
          ) : (
            <p>No content available for this lecture.</p>
          )}
        </div>
        
        {lectureData.material && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Supplementary Materials</h3>
            <div className="bg-accent1/5 rounded-lg p-4">
              <div dangerouslySetInnerHTML={{ __html: lectureData.material }} />
            </div>
          </div>
        )}
        
        {lectureData.links && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Additional Resources</h3>
            <div className="bg-primary/5 rounded-lg p-4">
              <div dangerouslySetInnerHTML={{ __html: lectureData.links }} />
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            className="gap-2" 
            onClick={() => onComplete(lecture.id)}
            disabled={lectureData.completed}
          >
            <Check className="h-4 w-4" />
            {lectureData.completed ? 'Completed' : 'Mark as Completed'}
          </Button>
        </div>
      </div>
    );
  };
  
  if (isLoading || isLoadingSiblings) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-accent1" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">{lectureData?.title}</h1>
          {lectureData?.description && (
            <p className="text-muted-foreground mt-1">{lectureData.description}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          {prevLecture && (
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => handleNavigate(prevLecture.id)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
          
          {nextLecture && (
            <Button 
              className="gap-2" 
              onClick={() => handleNavigate(nextLecture.id)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Lecture Content</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="pt-6">
          {renderVideoOrContent()}
        </TabsContent>
        <TabsContent value="discussions" className="pt-6">
          {lecture.id && lecture.courseId && (
            <DiscussionBoard 
              courseId={lecture.courseId}
              lectureId={lecture.id}
              title="Lecture Discussions"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
