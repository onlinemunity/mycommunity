import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { CourseCard } from '@/components/ui-components/CourseCard';
import { Sidebar } from '@/components/ui-components/Sidebar';
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

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const navigate = useNavigate();

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

  const { user, profile } = useAuth();

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

  // Filter courses by search query and category
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

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

  return (
    <Layout>
      <div className="page-transition container py-12 md:py-24">
        <SectionHeading
          title="Explore Our Courses"
          subtitle="Unlock new skills and expand your knowledge with our expert-led courses."
        />

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
          <Sidebar>
            <ScrollArea className="h-[550px] w-full rounded-md border p-2">
              <div className="pb-4">
                <h4 className="mb-1 font-medium">Category</h4>
                <div className="grid gap-1">
                  <Button
                    variant="outline"
                    className="justify-start rounded-md px-3.5 py-2 font-normal"
                    onClick={() => setCategoryFilter('all')}
                    active={categoryFilter === 'all'}
                  >
                    All Categories
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start rounded-md px-3.5 py-2 font-normal"
                    onClick={() => setCategoryFilter('Web Development')}
                    active={categoryFilter === 'Web Development'}
                  >
                    Web Development
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start rounded-md px-3.5 py-2 font-normal"
                    onClick={() => setCategoryFilter('Mobile Development')}
                    active={categoryFilter === 'Mobile Development'}
                  >
                    Mobile Development
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start rounded-md px-3.5 py-2 font-normal"
                    onClick={() => setCategoryFilter('Data Science')}
                    active={categoryFilter === 'Data Science'}
                  >
                    Data Science
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start rounded-md px-3.5 py-2 font-normal"
                    onClick={() => setCategoryFilter('Design')}
                    active={categoryFilter === 'Design'}
                  >
                    Design
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </Sidebar>

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
                {filteredAndSortedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    title={course.title}
                    description={course.description}
                    image={course.image}
                    rating={course.rating}
                    students={course.students}
                    duration={course.duration}
                    level={course.level}
                    instructor={course.instructor}
                    href={`/courses/${course.href}`}
                    onClick={() => navigate(`/courses/${course.href}`)}
                    isPremium={course.course_type === 'premium'}
                    isLocked={course.course_type === 'premium' && !hasPremiumAccess}
                    onEnrollClick={() => handleEnrollClick(course)}
                    delayAnimation={true}
                  />
                ))}
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
