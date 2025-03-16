
import { Course } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface CourseSidebarProps {
  course: Course;
}

export const CourseSidebar = ({ course }: CourseSidebarProps) => {
  const { user } = useAuth();

  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to enroll in this course",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Enrolled successfully!",
      description: "You have been enrolled in this course.",
    });
  };

  const features = [
    'Full lifetime access',
    'Access on mobile and desktop',
    'Certificate of completion',
    'Community support',
  ];

  return (
    <Card className="sticky top-6">
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="text-3xl font-bold mb-2">Free</div>
          <p className="text-sm text-muted-foreground">
            Start learning today
          </p>
        </div>

        <Button className="w-full mb-6" size="lg" onClick={handleEnroll}>
          Enroll Now
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
