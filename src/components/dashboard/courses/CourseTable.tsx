
import React from 'react';
import { ChevronDown, ChevronRight, CheckCircle, Video, FileText, ListTodo } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { Lecture } from '@/types/supabase';

interface CourseProgressProps {
  course: {
    id: string;
    title: string;
    description: string;
    progress: number;
    lectures: Lecture[];
  };
}

export const CourseTable: React.FC<CourseProgressProps> = ({ course }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Helper function to get lecture icon based on title/content
  const getLectureIcon = (lecture: Lecture) => {
    if (lecture.title?.toLowerCase().includes('quiz')) {
      return <ListTodo className="h-4 w-4 text-muted-foreground" />;
    } else if (!lecture.video_url) {
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    } else {
      return <Video className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Make sure lectures are sorted by sort_order
  const displayLectures = course.lectures.sort((a, b) => 
    (a.sort_order || 0) - (b.sort_order || 0)
  );
  
  const handleNavigateToLecture = (lectureId: string) => {
    console.log(`Navigating to lecture: ${lectureId}`);
    navigate(`/dashboard/courses/${course.id}/lecture/${lectureId}`);
  };
  
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-sm text-muted-foreground">{course.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{Math.round(course.progress)}% {t('dashboard.courses.completed')}</span>
            <Progress value={course.progress} className="w-32 h-2" />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">{t('dashboard.courses.lecture')}</TableHead>
              <TableHead>{t('dashboard.courses.duration')}</TableHead>
              <TableHead>{t('dashboard.courses.status')}</TableHead>
              <TableHead className="text-right">{t('dashboard.courses.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayLectures.length > 0 ? (
              displayLectures.map((lecture) => (
                <TableRow key={lecture.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleNavigateToLecture(lecture.id)}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {getLectureIcon(lecture)}
                    {lecture.title}
                  </TableCell>
                  <TableCell>{lecture.duration}</TableCell>
                  <TableCell>
                    {lecture.completed ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs">{t('dashboard.courses.completed')}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">{t('dashboard.courses.inProgress')}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigateToLecture(lecture.id);
                      }}
                    >
                      {lecture.completed ? t('dashboard.courses.review') : t('dashboard.courses.continue')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No lectures found for this course
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
