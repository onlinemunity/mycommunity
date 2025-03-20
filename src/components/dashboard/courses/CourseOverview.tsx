
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';

interface CourseOverviewProps {
  course: {
    title: string;
    description: string;
    introVideo: string;
    duration: string;
    lectureCount: number;
    progress: number;
    id?: string;
  };
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({ course }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {course.id ? (
              <Link to={`/dashboard/courses/${course.id}`} className="hover:underline hover:text-accent1">
                {course.title}
              </Link>
            ) : (
              course.title
            )}
          </CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        
       <CardContent>
  <div className="flex gap-6 mb-6">
    {/* Video Section */}
    <div className="w-7/10 aspect-video relative rounded-md overflow-hidden">
      <iframe
        src={course.introVideo}
        className="absolute inset-0 w-full h-full"
        title={`${course.title} intro video`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        frameBorder="0"
        allowFullScreen
      />
    </div>

    {/* Details Section */}
    <div className="w-3/10 flex flex-col justify-between">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t('dashboard.courses.duration')}</p>
            <p className="text-sm text-muted-foreground">{course.duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t('dashboard.courses.lectures')}</p>
            <p className="text-sm text-muted-foreground">{course.lectureCount} {t('dashboard.courses.lessons')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{t('dashboard.courses.yourProgress')}</p>
            <div className="flex items-center gap-2">
              <Progress value={course.progress} className="w-24 h-2" />
              <span className="text-xs">{Math.round(course.progress)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</CardContent>

      </Card>
    </div>
  );
};
