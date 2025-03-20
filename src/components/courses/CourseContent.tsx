
import { Course, Lecture } from '@/types/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Video, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface CourseContentProps {
  course: Course;
}

export const CourseContent = ({ course }: CourseContentProps) => {
  const { user } = useAuth();
  
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
      return data as Lecture[];
    },
  });

  // Group lectures by section (create sections based on sort_order)
  const getSections = () => {
    if (!lectures || lectures.length === 0) return [];
    
    // Create sections based on sort_order ranges
    const lecturesBySection = lectures.reduce((sections: Record<string, any[]>, lecture) => {
      // Place in sections based on sort_order
      let sectionTitle;
      if (lecture.sort_order < 3) {
        sectionTitle = 'Introduction';
      } else if (lecture.sort_order < 6) {
        sectionTitle = 'Core Content';
      } else {
        sectionTitle = 'Advanced Topics';
      }
      
      // Initialize section if it doesn't exist
      if (!sections[sectionTitle]) {
        sections[sectionTitle] = [];
      }
      
      // Add lecture to section
      sections[sectionTitle].push({
        id: lecture.id,
        title: lecture.title,
        type: lecture.title.startsWith('Quiz:') ? 'quiz' : lecture.video_url ? 'video' : 'doc',
        duration: lecture.duration
      });
      
      return sections;
    }, {});
    
    // Convert to array format for rendering
    return Object.entries(lecturesBySection).map(([title, items]) => ({
      title,
      items
    }));
  };

  // Create sections from lectures data
  const displaySections = lectures && lectures.length > 0 
    ? getSections() 
    : [
        {
          title: 'Introduction',
          items: [
            { title: course.allgemein, type: 'video', duration: '5:20' },
            { title: course.zielgruppe, type: 'video', duration: '10:15' },
            { title: course.material, type: 'doc', duration: '15 mins read' },
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
                <h3 className="font-sm mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {section.items.map((item, j) => {
                    // Determine the path to use for linking
                    const linkPath = user 
                      ? `/dashboard/courses/${course.href}/lecture/${item.id}`
                      : `/auth?redirect=/dashboard/courses/${course.href}/lecture/${item.id}`;
                    
                    return (
                      <Link 
                        key={j}
                        to={linkPath}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group block"
                      >
                        <div className="flex items-center gap-3">
                          {item.type === 'video' && <Video className="h-4 w-4" />}
                          {item.type === 'doc' && <FileText className="h-4 w-4" />}
                          {(item.type === 'exercise' || item.type === 'quiz') && <BookOpen className="h-4 w-4" />}
                          <span class="text-sm style={{ whiteSpace: 'pre-line' }}">{item.title}</span>
                        </div>
                       
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
