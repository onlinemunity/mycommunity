
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
         <div className="space-y-6">
        <div className="flex items-center gap-4">
            {course.inhalte}
          
            {course.video_url}
          Text zum checken: 1
          
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
