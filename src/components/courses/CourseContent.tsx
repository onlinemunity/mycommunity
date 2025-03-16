
import { Course } from '@/types/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Video, FileText } from 'lucide-react';

interface CourseContentProps {
  course: Course;
}

export const CourseContent = ({ course }: CourseContentProps) => {
  // Sample course content sections - in a real app, this would come from the database
  const sections = [
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sections.map((section, i) => (
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
                      {item.type === 'exercise' && <BookOpen className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
