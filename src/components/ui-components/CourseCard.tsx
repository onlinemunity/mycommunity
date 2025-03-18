
import { ReactNode, useEffect, useState } from "react";
import { Clock, Users, Star, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  instructor: string;
  category: string;
  duration: string;
  students: number;
  rating: number;
  level: "beginner" | "intermediate" | "advanced";
  free?: boolean;
  price?: string;
  href: string;
  className?: string;
  animated?: boolean;
  delay?: number;
}

export const CourseCard = ({
  title,
  description,
  image,
  instructor,
  category,
  duration,
  students,
  rating,
  level,
  free = false,
  price,
  href,
  className,
  animated = true,
  delay = 0,
}: CourseCardProps) => {
  const { user } = useAuth();
  const [enrollmentProgress, setEnrollmentProgress] = useState<number | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchEnrollmentStatus = async () => {
      if (!user) return;
      
      try {
        // First, get the course id from the href
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('id')
          .eq('href', href)
          .maybeSingle();
        
        if (courseError || !courseData) {
          console.error('Error fetching course id:', courseError);
          return;
        }
        
        // Then check if the user is enrolled
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('progress')
          .eq('user_id', user.id)
          .eq('course_id', courseData.id)
          .maybeSingle();
          
        if (enrollmentError) {
          console.error('Error fetching enrollment:', enrollmentError);
          return;
        }
        
        if (enrollmentData) {
          setIsEnrolled(true);
          setEnrollmentProgress(enrollmentData.progress);
        }
      } catch (error) {
        console.error('Error checking enrollment status:', error);
      }
    };
    
    fetchEnrollmentStatus();
  }, [user, href]);

  const levelColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-blue-100 text-blue-800",
    advanced: "bg-purple-100 text-purple-800",
  };

  const getLevelLabel = (): string => {
    const labels = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    };
    return labels[level];
  };

  return (
    <Link
      to={user && isEnrolled ? `/dashboard/courses/${href}` : `/courses/${href}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-metal/30 bg-white hover:shadow-elevated transition-all duration-300",
        animated && "animate-scale-in",
        className
      )}
      style={animated ? { animationDelay: `${delay}ms` } : {}}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <Badge 
          className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-foreground hover:bg-white/90"
        >
          {category}
        </Badge>

        <Badge 
          className={cn(
            "absolute top-3 right-3",
            levelColors[level],
            "hover:bg-opacity-90"
          )}
        >
          {getLevelLabel()}
        </Badge>
        
        {isEnrolled && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">Your progress</span>
              <span className="text-xs font-medium">{Math.round(enrollmentProgress || 0)}%</span>
            </div>
            <Progress value={enrollmentProgress || 0} className="h-1.5" />
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display font-bold text-lg mb-2 group-hover:text-accent1 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {duration}
          </div>
          <div className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1" />
            {students} students
          </div>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 mr-1 fill-accent1 text-accent1" />
            {rating.toFixed(1)}
          </div>
          {isEnrolled && (
            <div className="flex items-center">
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              Continue learning
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-metal/20">
          <div className="text-sm">
            By <span className="font-medium">{instructor}</span>
          </div>
          <div>
            {isEnrolled ? (
              <Badge variant="secondary" className="bg-accent1/10 text-accent1 hover:bg-accent1/20">
                Enrolled
              </Badge>
            ) : free ? (
              <span className="font-medium text-accent1">Free</span>
            ) : (
              <span className="font-medium">{price}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
