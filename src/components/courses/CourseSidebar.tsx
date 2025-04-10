
import { Course } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface CourseSidebarProps {
  course: Course;
}

export const CourseSidebar = ({ course }: CourseSidebarProps) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);

  // Check if user is already enrolled
  const { data: isEnrolled, isLoading } = useQuery({
    queryKey: ['enrollment', course.id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error checking enrollment:', error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user,
  });

  // Determine if user can enroll based on their user_type and course_type
  const canEnroll = () => {
    if (!profile || !course.course_type) return true; // Default to allowing enrollment if types not set
    
    if (profile.user_type === 'premium') return true; // Premium users can enroll in any course
    
    // Basic users can only enroll in basic courses
    return profile.user_type === 'basic' && course.course_type === 'basic';
  };

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to enroll in this course",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (isEnrolled) {
      navigate(`/dashboard/courses/${course.id}`);
      return;
    }

    // Check if user can enroll in this course type
    if (!canEnroll()) {
      toast({
        title: "Premium course",
        description: "You need a premium membership to enroll in this course",
        variant: "destructive",
      });
      navigate('/pricing'); // Navigate to pricing/upgrade page
      return;
    }
    
    setEnrolling(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Enrolled successfully!",
        description: "You have been enrolled in this course.",
      });
      
      // Redirect to the course in dashboard
      navigate(`/dashboard/courses/${course.id}`);
    } catch (error: any) {
      toast({
        title: "Enrollment failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const isPremiumCourse = course.course_type === 'premium';
  const userCanAccessPremium = profile?.user_type === 'premium';

  const features = [
    'Full lifetime access',
    'Access on mobile and desktop',
    'Certificate of completion',
    'Community support',
  ];

  return (
    <Card className="sticky top-6">
      <CardContent className="pt-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold mb-2">
              {isPremiumCourse ? 'Premium' : 'Free'}
            </div>
            <p className="text-sm text-muted-foreground">
              {isPremiumCourse ? 'Premium membership required' : 'Start learning today'}
            </p>
          </div>
          
          {isPremiumCourse && (
            <div className="bg-amber-100 p-2 rounded-full">
              <Lock className="h-5 w-5 text-amber-600" />
            </div>
          )}
        </div>

        <Button 
          className="w-full mb-6" 
          size="lg" 
          onClick={handleEnroll}
          disabled={enrolling || isLoading || (isPremiumCourse && !userCanAccessPremium)}
        >
          {enrolling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enrolling...
            </>
          ) : isEnrolled ? (
            'Go to Course'
          ) : isPremiumCourse && !userCanAccessPremium ? (
            'Upgrade to Premium'
          ) : (
            'Enroll Now'
          )}
        </Button>

        <div className="space-y-4">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
