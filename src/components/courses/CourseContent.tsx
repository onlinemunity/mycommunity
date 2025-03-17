
import { Course } from '@/types/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Video, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface CourseContentProps {
  course: Course;
}

export const CourseContent = ({ course }: CourseContentProps) => {
  // Fetch lectures for this course
  const { data: lectures, isLoading } = useQuery({
    queryKey: ['course-lectures', course.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('course_id', course.id)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Group lectures by section (here we'll just create artificial sections)
  const getSections = () => {
    if (!lectures || lectures.length === 0) return [];
    
    // Create simple sections: Introduction, Core Content, and Advanced Topics
    const intro = lectures.slice(0, 2);
    const core = lectures.slice(2, 5);
    const advanced = lectures.slice(5);
    
    const sections = [];
    
    if (intro.length > 0) {
      sections.push({
        title: 'Introduction',
        items: intro.map(lecture => ({
          title: lecture.title,
          type: lecture.title.startsWith('Quiz:') ? 'quiz' : lecture.video_url ? 'video' : 'doc',
          duration: lecture.duration
        }))
      });
    }
    
    if (core.length > 0) {
      sections.push({
        title: 'Core Content',
        items: core.map(lecture => ({
          title: lecture.title,
          type: lecture.title.startsWith('Quiz:') ? 'quiz' : lecture.video_url ? 'video' : 'doc',
          duration: lecture.duration
        }))
      });
    }
    
    if (advanced.length > 0) {
      sections.push({
        title: 'Advanced Topics',
        items: advanced.map(lecture => ({
          title: lecture.title,
          type: lecture.title.startsWith('Quiz:') ? 'quiz' : lecture.video_url ? 'video' : 'doc',
          duration: lecture.duration
        }))
      });
    }
    
    return sections;
  };

  // If no real lectures, fall back to sample data
  const fallbackSections = [
    {
      title: 'Introduction',
      items: [
        { title: 'Welcome to the course', type: 'video', duration: '5:20' },
        { title: 'Course overview', type: 'video', duration: '10:15' },
        { title: 'Getting started', type: 'doc', duration: '15 mins read' },
      ],
    },
    {
      title: 'Core Concepts',
      items: [
        { title: 'Understanding the basics', type: 'video', duration: '15:30' },
        { title: 'Key principles', type: 'doc', duration: '20 mins read' },
        { title: 'Practical examples', type: 'exercise', duration: '30 mins' },
      ],
    },
  ];

  const displaySections = lectures && lectures.length > 0 ? getSections() : fallbackSections;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-accent1" />
          </div>
        ) : (
          <div className="space-y-6">
            {displaySections.map((section, i) => (
              <div key={i}>
                <h3 className="font-medium mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {section.items.map((item, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {item.type === 'video' && <Video className="h-4 w-4" />}
                        {item.type === 'doc' && <FileText className="h-4 w-4" />}
                        {(item.type === 'exercise' || item.type === 'quiz') && <BookOpen className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
