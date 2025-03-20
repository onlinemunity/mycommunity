
import { Course } from '@/types/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CourseVideoProps {
  course: Course;
}

export const CourseVideo = ({ course }: CourseVideoProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Video</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
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
        </div>
      </CardContent>
    </Card>
  );
};

         
   
