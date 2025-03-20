
import { Course } from '@/types/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CourseVideoProps {
  course: Course;
}

const embedYouTubeUrl = (url: string) => {
  const videoId = url.split('v=')[1]?.split('&')[0]; // Extrahiere die Video-ID
  return `https://www.youtube.com/embed/${videoId}`;
};

export const CourseVideo = ({ course }: CourseVideoProps) => {
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com')) {
      // Wenn es sich um eine YouTube-URL handelt, konvertiere sie
      return embedYouTubeUrl(url);
    }
    return url; // Andernfalls, nehme die URL wie sie ist (z.B. für Vimeo)
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>{course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
            {course.inhalte}
          
            {course.video_url}
          
          {course.video_url && (
            <div className="aspect-video relative rounded-md overflow-hidden dangerouslySetInnerHTML={{ __html: embedHtml }}">
              <iframe
                src=(course.video_url)  // Die umgewandelte URL wird verwendet
                className="absolute inset-0 w-full h-64"
                title={`${course.title} preview video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                frameBorder="0"
                allowFullScreen
              />
            </iframe>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
