
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { CourseCard } from '@/components/ui-components/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Fetch courses
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Filter courses by search query and category
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  // Check for premium membership
  const isAuthenticated = !!user;
  const hasPremiumAccess = isAuthenticated && (profile?.user_type === 'premium' || profile?.user_type === 'pro');
  const showPremiumBanner = !hasPremiumAccess && filteredCourses.some(course => course.course_type === 'premium');

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [navigate]);

  // Handle premium course enrollment
  const handleEnrollClick = (course: Course) => {
    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent(`/courses/${course.href}`)}`);
      return;
    }

    if (course.course_type === 'premium' && !hasPremiumAccess) {
      // Show upgrade required message
      toast({
        title: "Premium Course",
        description: "You need a Premium or Pro membership to access this course.",
      });
      
      // Navigate to pricing page
      navigate('/pricing');
      return;
    }

    // Handle enrollment logic here
    // For now, just navigate to the course page
    navigate(`/courses/${course.href}`);
  };

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
    } else if (sortOrder === 'rating') {
      return b.rating - a.rating;
    }
    return 0;
  });

  const filteredAndSortedCourses = sortedCourses;
  
  // Helper function to safely type cast the course level
  const safelyTypeCastCourseLevel = (level: string): "beginner" | "intermediate" | "advanced" => {
    const validLevels: ("beginner" | "intermediate" | "advanced")[] = ["beginner", "intermediate", "advanced"];
    return validLevels.includes(level.toLowerCase() as any) 
      ? level.toLowerCase() as "beginner" | "intermediate" | "advanced" 
      : "beginner";
  };

  return (
    <Layout>
      <div className="page-transition container py-12 md:py-24">
        <SectionHeading
          title="Explore Our Courses"
          subtitle="Unlock new skills and expand your knowledge with our expert-led courses."
        />

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          <div className="h-full">
            <ScrollArea className="h-[550px] w-full rounded-md border p-2">
              <div className="pb-4">
                <h4 className="mb-1 font-medium">Category</h4>
                <div className="grid gap-1">
                  <Button
                    variant="outline"
                    className={cn("justify-start rounded-md px-3.5 py-2 font-normal", 
                      categoryFilter === 'all' ? "bg-accent text-accent-foreground" : "")}
                    onClick={() => setCategoryFilter('all')}
                  >
                    All Categories
                  </Button>
                  <Button
                    variant="outline"
                    className={cn("justify-start rounded-md px-3.5 py-2 font-normal", 
                      categoryFilter === 'Web Development' ? "bg-accent text-accent-foreground" : "")}
                    onClick={() => setCategoryFilter('Web Development')}
                  >
                    Web Development
                  </Button>
                  <Button
                    variant="outline"
                    className={cn("justify-start rounded-md px-3.5 py-2 font-normal", 
                      categoryFilter === 'Mobile Development' ? "bg-accent text-accent-foreground" : "")}
                    onClick={() => setCategoryFilter('Mobile Development')}
                  >
                    Mobile Development
                  </Button>
                  <Button
                    variant="outline"
                    className={cn("justify-start rounded-md px-3.5 py-2 font-normal", 
                      categoryFilter === 'Data Science' ? "bg-accent text-accent-foreground" : "")}
                    onClick={() => setCategoryFilter('Data Science')}
                  >
                    Data Science
                  </Button>
                  <Button
                    variant="outline"
                    className={cn("justify-start rounded-md px-3.5 py-2 font-normal", 
                      categoryFilter === 'Design' ? "bg-accent text-accent-foreground" : "")}
                    onClick={() => setCategoryFilter('Design')}
                  >
                    Design
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-8">
            {showPremiumBanner && (
              <div className="bg-gradient-to-r from-accent1/10 to-accent2/10 rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Unlock Premium Courses</h3>
                    <p className="text-muted-foreground">Get unlimited access to all premium courses with a membership.</p>
                  </div>
                  <Button onClick={() => navigate('/pricing')} className="whitespace-nowrap">
                    View Memberships
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-8 w-full md:w-auto"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid h-32 place-items-center">
                <Badge variant="secondary">Loading courses...</Badge>
              </div>
            ) : filteredAndSortedCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedCourses.map((course) => {
                  const safeCourse: Course = {
                    ...course,
                    level: safelyTypeCastCourseLevel(course.level || 'beginner'),
                  };
                  
                  return (
                    <CourseCard
                      key={safeCourse.id}
                      title={safeCourse.title}
                      description={safeCourse.description}
                      image={safeCourse.image}
                      rating={safeCourse.rating}
                      students={safeCourse.students}
                      duration={safeCourse.duration}
                      level={safeCourse.level}
                      instructor={safeCourse.instructor}
                      href={`/courses/${safeCourse.href}`}
                      onClick={() => navigate(`/courses/${safeCourse.href}`)}
                      isPremium={safeCourse.course_type === 'premium'}
                      isLocked={safeCourse.course_type === 'premium' && !hasPremiumAccess}
                      onEnrollClick={() => handleEnrollClick(safeCourse)}
                      delayAnimation={true}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="grid h-32 place-items-center">
                <Badge variant="secondary">No courses found.</Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
