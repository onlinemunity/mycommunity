
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { CourseCard } from '@/components/ui-components/CourseCard';
import { Search, Filter, BookOpen, Clock, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

// Course difficulty level types
type DifficultyLevel = 'all' | 'beginner' | 'intermediate' | 'advanced';
type CategoryType = 'all' | 'development' | 'design' | 'business' | 'marketing';

const Courses = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of HTML, CSS, and JavaScript to build responsive websites.',
      image: '/placeholder.svg',
      lessons: 24,
      duration: '10 hours',
      difficulty: 'beginner',
      category: 'development',
      price: 'Free',
      featured: true,
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts like hooks, context, and custom renderers.',
      image: '/placeholder.svg',
      lessons: 18,
      duration: '8 hours',
      difficulty: 'advanced',
      category: 'development',
      price: 'Premium',
      featured: true,
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      description: 'Learn the core principles of effective user interface and experience design.',
      image: '/placeholder.svg',
      lessons: 15,
      duration: '6 hours',
      difficulty: 'intermediate',
      category: 'design',
      price: 'Free',
      featured: false,
    },
    {
      id: 4,
      title: 'Digital Marketing Essentials',
      description: 'Understand the fundamentals of digital marketing and customer acquisition.',
      image: '/placeholder.svg',
      lessons: 20,
      duration: '8 hours',
      difficulty: 'beginner',
      category: 'marketing',
      price: 'Premium',
      featured: false,
    },
    {
      id: 5,
      title: 'Business Strategy for Startups',
      description: 'Learn how to develop effective business strategies for early-stage companies.',
      image: '/placeholder.svg',
      lessons: 12,
      duration: '5 hours',
      difficulty: 'intermediate',
      category: 'business',
      price: 'Premium',
      featured: true,
    },
    {
      id: 6,
      title: 'Data Visualization with D3.js',
      description: 'Create powerful interactive data visualizations using the D3.js library.',
      image: '/placeholder.svg',
      lessons: 16,
      duration: '7 hours',
      difficulty: 'advanced',
      category: 'development',
      price: 'Premium',
      featured: false,
    },
  ];

  // Filter courses based on search, difficulty, and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || course.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-blue-50 py-16">
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
              
              {/* Search bar */}
              <div className="relative max-w-xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  className="input-base pl-10 w-full"
                  placeholder={t('courses.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="section-padding bg-background">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <SectionHeading
                title={t('courses.list.title')}
                subtitle={t('courses.list.subtitle')}
                align="left"
              />
              
              <button 
                className="flex items-center gap-2 md:hidden mt-4 text-sm font-medium"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Filter size={16} />
                {t('courses.filters.toggle')}
                <ChevronDown size={16} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters - Always visible on desktop, toggleable on mobile */}
              <div className={`lg:block ${filtersOpen ? 'block' : 'hidden'} glassmorphism p-6 rounded-xl mb-6 lg:mb-0`}>
                <h3 className="heading-sm mb-4">{t('courses.filters.title')}</h3>
                
                {/* Difficulty filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">{t('courses.filters.difficulty')}</h4>
                  <div className="space-y-2">
                    {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="difficulty"
                          checked={difficultyFilter === level}
                          onChange={() => setDifficultyFilter(level)}
                          className="rounded-full h-4 w-4 text-accent1"
                        />
                        <span className="text-sm">
                          {t(`courses.filters.levels.${level}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Category filter */}
                <div>
                  <h4 className="font-medium mb-2">{t('courses.filters.category')}</h4>
                  <div className="space-y-2">
                    {(['all', 'development', 'design', 'business', 'marketing'] as const).map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={categoryFilter === category}
                          onChange={() => setCategoryFilter(category)}
                          className="rounded-full h-4 w-4 text-accent1"
                        />
                        <span className="text-sm">
                          {t(`courses.filters.categories.${category}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Course list */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        title={course.title}
                        description={course.description}
                        image={course.image}
                        badges={[
                          { text: t(`courses.difficulty.${course.difficulty}`), variant: 'secondary' },
                          { text: course.price, variant: course.price === 'Free' ? 'success' : 'primary' }
                        ]}
                        footerItems={[
                          { icon: <BookOpen className="h-4 w-4" />, text: `${course.lessons} ${t('courses.lessons')}` },
                          { icon: <Clock className="h-4 w-4" />, text: course.duration }
                        ]}
                        href={`/courses/${course.id}`}
                        featured={course.featured}
                      />
                    ))
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="heading-sm mb-2">{t('courses.noResults.title')}</h3>
                      <p className="text-muted-foreground">{t('courses.noResults.message')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-accent1/10 to-accent2/10">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-lg mb-6">
                {t('courses.cta.title')}
              </h2>
              <p className="body-lg mb-8 text-muted-foreground">
                {t('courses.cta.subtitle')}
              </p>
              <button className="button-primary">
                {t('courses.cta.button')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Courses;
