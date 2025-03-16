
import { Course } from '@/types/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CourseInstructorProps {
  course: Course;
}

export const CourseInstructor = ({ course }: CourseInstructorProps) => {
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
        <CardTitle>Your Instructor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{getInitials(course.instructor)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{course.instructor}</h3>
            <p className="text-sm text-muted-foreground">
              Expert instructor with years of industry experience
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
