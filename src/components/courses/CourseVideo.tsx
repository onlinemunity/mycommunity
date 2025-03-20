
import { Course, Lecture } from '@/types/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Video, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface CourseVideoProps {
  course: Course;
}

export const CourseVideo = ({ course }: CourseVideoProps) => {
  const { user } = useAuth();
  


 
      
   
  };

 

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video</CardTitle>
      </CardHeader>
      <CardContent>

         {course.video_url && (
            <div className="mb-10">
              <div className="aspect-video relative rounded-md overflow-hidden">
                <iframe
                  src={course.video_url}
                  className="absolute inset-0 w-full h-full"
                  title={`${course.title} preview video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        
      </CardContent>
    </Card>
  );
};
