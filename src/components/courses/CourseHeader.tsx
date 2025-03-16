
import { Course } from '@/types/supabase';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Clock } from 'lucide-react';

interface CourseHeaderProps {
  course: Course;
}

export const CourseHeader = ({ course }: CourseHeaderProps) => {
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-12">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Badge>{course.category}</Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span>{course.rating} rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{course.students} students</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{course.duration}</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <img 
              src={course.image} 
              alt={course.title}
              className="w-full rounded-lg shadow-lg object-cover aspect
              -video"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
