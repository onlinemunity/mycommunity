
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { CourseCard } from '@/components/ui-components/CourseCard';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Search, Filter, BookOpen, Clock, Users, BadgeCheck, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/supabase';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

const Courses = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating'>('popular');
  
  // Function to fetch all categories with counts
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('category')
      .order('category');
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    // Count categories
    const categoryCounts: Record<string, number> = {};
    data.forEach(course => {
      categoryCounts[course.category] = (categoryCounts[course.category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
  };
  
  // Function to fetch courses with filters and sorting
  const fetchCourses = async () => {
    let query = supabase.from('courses').select('*');
    
    // Apply search filter
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    // Apply category filters
    if (selectedCategories.length > 0) {
      query = query.in('category', selectedCategories);
    }
    
    // Apply level filters
    if (selectedLevels.length > 0) {
      query = query.in('level', selectedLevels);
    }
    
    // Apply duration filters
    if (selectedDurations.length > 0) {
      // For duration, we need to manually filter after fetching
      // since it's a text field and requires special handling
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'popular':
        query = query.order('students', { ascending: false });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error fetching courses",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
    
    // Apply duration filters manually
    let filteredData = data;
    if (selectedDurations.length > 0) {
      filteredData = data.filter(course => {
        const weekCount = parseInt(course.duration.split(' ')[0]);
        if (selectedDurations.includes('< 4 weeks') && weekCount < 4) return true;
        if (selectedDurations.includes('4-8 weeks') && weekCount >= 4 && weekCount <= 8) return true;
        if (selectedDurations.includes('> 8 weeks') && weekCount > 8) return true;
        return false;
      });
    }
    
    return filteredData as Course[];
  };
  
  // Use React Query to fetch categories and courses
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  const coursesQuery = useQuery({
    queryKey: ['courses', searchTerm, selectedCategories, selectedLevels, selectedDurations, sortBy],
    queryFn: fetchCourses
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchInput = (e.target as HTMLFormElement).querySelector('input')?.value || '';
    setSearchTerm(searchInput);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const handleLevelChange = (level: string) => {
    setSelectedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level) 
        : [...prev, level]
    );
  };
  
  const handleDurationChange = (duration: string) => {
    setSelectedDurations(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration) 
        : [...prev, duration]
    );
  };
  
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedDurations([]);
    setSearchTerm('');
  };
  
  const features = [
    { name: 'Project-Based Learning', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Self-Paced Courses', icon: <Clock className="h-5 w-5" /> },
    { name: 'Community Support', icon: <Users className="h-5 w-5" /> },
    { name: 'Verified Certificates', icon: <BadgeCheck className="h-5 w-5" /> },
  ];

  return (
    <Layout>
      <div className="page-transition">
        <section className="bg-gradient-to-b from-white to-blue-50 py-20">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="heading-xl mb-6">
                <span className="text-gradient">
                  {t('courses.hero.title')}
                </span>
              </h1>
              <p className="body-lg mb-8 text-muted-foreground">
                {t('courses.hero.subtitle')}
              </p>
              
              <div className="max-w-lg mx-auto">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input 
                    className="pl-10 h-12 bg-white rounded-lg" 
                    type="search" 
                    placeholder={t('courses.hero.searchPlaceholder')}
                    defaultValue={searchTerm}
                  />
                  <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10">
                    {t('courses.hero.searchButton')}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container-wide">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((feature, i) => (
                <div 
                  key={i}
                  className="bg-white rounded-xl p-6 border border-metal/30 shadow-sm flex items-center gap-4"
                >
                  <div className="bg-primary/10 rounded-full p-2">
                    {feature.icon}
                  </div>
                  <div className="font-medium">{feature.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="section-padding bg-muted/30">
          <div className="container-wide">
            <SectionHeading
              title={t('courses.popular.title')}
              subtitle={t('courses.popular.subtitle')}
              align="center"
            />
            
            <div className="mt-8 flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-64 space-y-6">
                <div className="bg-white rounded-xl border border-metal/30 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-5 w-5 text-accent1" />
                    <h3 className="font-semibold">{t('courses.filters.title')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">{t('courses.filters.categories')}</h4>
                      <div className="space-y-2">
                        {categoriesQuery.isLoading ? (
                          <div className="flex justify-center py-2">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : categoriesQuery.data?.map((category, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <label className="text-sm flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={selectedCategories.includes(category.name)}
                                onChange={() => handleCategoryChange(category.name)}
                              />
                              {category.name}
                            </label>
                            <span className="text-xs text-muted-foreground">({category.count})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-metal/30">
                      <h4 className="text-sm font-medium mb-2">{t('courses.filters.level')}</h4>
                      <div className="space-y-2">
                        {['beginner', 'intermediate', 'advanced'].map((level, i) => (
                          <div key={i} className="flex items-center">
                            <label className="text-sm flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={selectedLevels.includes(level)}
                                onChange={() => handleLevelChange(level)}
                              />
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-metal/30">
                      <h4 className="text-sm font-medium mb-2">{t('courses.filters.duration')}</h4>
                      <div className="space-y-2">
                        {['< 4 weeks', '4-8 weeks', '> 8 weeks'].map((duration, i) => (
                          <div key={i} className="flex items-center">
                            <label className="text-sm flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="mr-2"
                                checked={selectedDurations.includes(duration)}
                                onChange={() => handleDurationChange(duration)}
                              />
                              {duration}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" onClick={resetFilters}>
                    {t('courses.filters.resetButton')}
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <Badge 
                      variant={sortBy === 'newest' ? 'default' : 'outline'} 
                      className="cursor-pointer"
                      onClick={() => setSortBy('newest')}
                    >
                      {t('courses.sortby.newest')}
                    </Badge>
                    <Badge 
                      variant={sortBy === 'popular' ? 'default' : 'outline'} 
                      className="cursor-pointer"
                      onClick={() => setSortBy('popular')}
                    >
                      {t('courses.sortby.popular')}
                    </Badge>
                    <Badge 
                      variant={sortBy === 'rating' ? 'default' : 'outline'} 
                      className="cursor-pointer"
                      onClick={() => setSortBy('rating')}
                    >
                      {t('courses.sortby.rating')}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {coursesQuery.data?.length || 0} {t('courses.results')}
                  </div>
                </div>
                
                {coursesQuery.isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-accent1" />
                  </div>
                ) : coursesQuery.error ? (
                  <div className="text-center py-12">
                    <p className="text-red-500 mb-4">Failed to load courses</p>
                    <Button onClick={() => coursesQuery.refetch()}>Try Again</Button>
                  </div>
                ) : coursesQuery.data?.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground mb-4">No courses match your filters</p>
                    <Button onClick={resetFilters}>Reset Filters</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coursesQuery.data?.map((course) => (
                      <CourseCard
                        key={course.id}
                        title={course.title}
                        description={course.description}
                        image={course.image}
                        rating={course.rating}
                        instructor={course.instructor}
                        duration={course.duration}
                        level={course.level}
                        students={course.students}
                        category={course.category}
                        href={course.href}
                      />
                    ))}
                  </div>
                )}
                
                {(coursesQuery.data?.length || 0) > 0 && (
                  <div className="mt-10 flex justify-center">
                    <Button>
                      {t('courses.loadMoreButton')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-gradient-to-br from-accent1/10 to-accent2/10">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-lg mb-6">
                {t('courses.cta.title')}
              </h2>
              <p className="body-lg mb-8 text-muted-foreground">
                {t('courses.cta.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button className="button-primary">
                  {t('courses.cta.button')}
                </Button>
                <Button variant="outline">
                  {t('courses.cta.secondaryButton')}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Courses;
