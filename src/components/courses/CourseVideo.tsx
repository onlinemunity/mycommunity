
import { Course } from '@/types/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CourseVideoProps {
  course: Course;
}

export const CourseVideo = ({ course }: CourseVideoProps) => {
  

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {course.inhalte}
         {course.video_url && (
  
    <div className="aspect-video relative rounded-md overflow-hidden">
      <iframe
        src={course.video_url}  // Ohne `{}` um den String zu interpolieren
        className="absolute inset-0 w-full h-full"
        title={`${course.title} preview video`}  // Template-String verwendet
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        frameBorder="0"
        allowFullScreen
      />
    </div>
 
)}
        </div>
      </CardContent>
    </Card>
  );
};

         
   
