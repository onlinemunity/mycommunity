import React from 'react';
import { Layout } from '@/components/Layout';
import { CourseCard } from '@/components/ui-components/CourseCard';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Search, Filter, BookOpen, Clock, Users, BadgeCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Courses = () => {
  const { t } = useTranslation();
  
  const popularCourses = [
    {
      id: 1,
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
      image: '/placeholder.svg',
      rating: 4.8,
      students: 1250,
      duration: '8 weeks',
      level: 'beginner' as const,
      instructor: 'Alex Johnson',
      category: 'Web Development',
      href: '/course/intro-web-dev'
    },
    {
      id: 2,
      title: 'Advanced React & Redux',
      description: 'Master React.js, Redux, Hooks, and best practices for building scalable applications.',
      image: '/placeholder.svg',
      rating: 4.9,
      students: 940,
      duration: '10 weeks',
      level: 'intermediate' as const,
      instructor: 'Sarah Miller',
      category: 'Frontend',
      href: '/course/advanced-react'
    },
    {
      id: 3,
      title: 'UI/UX Design Principles',
      description: 'Understand the core principles of user experience and interface design.',
      image: '/placeholder.svg',
      rating: 4.7,
      students: 780,
      duration: '6 weeks',
      level: 'beginner' as const,
      instructor: 'Michael Chen',
      category: 'Design',
      href: '/course/uiux-design'
    },
    {
      id: 4,
      title: 'Node.js Backend Development',
      description: 'Build scalable backends with Node.js, Express, and MongoDB.',
      image: '/placeholder.svg',
      rating: 4.6,
      students: 620,
      duration: '8 weeks',
      level: 'intermediate' as const,
      instructor: 'Jessica Brown',
      category: 'Backend',
      href: '/course/nodejs-backend'
    },
    {
      id: 5,
      title: 'DevOps & CI/CD Pipelines',
      description: 'Learn to automate your development workflow with modern DevOps practices.',
      image: '/placeholder.svg',
      rating: 4.8,
      students: 450,
      duration: '12 weeks',
      level: 'advanced' as const,
      instructor: 'David Wilson',
      category: 'DevOps',
      href: '/course/devops-cicd'
    },
    {
      id: 6,
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to core machine learning concepts and practical applications.',
      image: '/placeholder.svg',
      rating: 4.9,
      students: 820,
      duration: '10 weeks',
      level: 'intermediate' as const,
      instructor: 'Emily Zhang',
      category: 'Data Science',
      href: '/course/ml-fundamentals'
    }
  ];
  
  const categories = [
    { name: 'Web Development', count: 28 },
    { name: 'UI/UX Design', count: 15 },
    { name: 'Mobile Development', count: 12 },
    { name: 'Data Science', count: 20 },
    { name: 'DevOps', count: 8 },
    { name: 'Cyber Security', count: 10 },
  ];
  
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input 
                    className="pl-10 h-12 bg-white rounded-lg" 
                    type="search" 
                    placeholder={t('courses.hero.searchPlaceholder')}
                  />
                  <Button className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10">
                    {t('courses.hero.searchButton')}
                  </Button>
                </div>
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
                        {categories.map((category, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <label className="text-sm flex items-center cursor-pointer">
                              <input type="checkbox" className="mr-2" />
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
                        {['Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((level, i) => (
                          <div key={i} className="flex items-center">
                            <label className="text-sm flex items-center cursor-pointer">
                              <input type="checkbox" className="mr-2" />
                              {level}
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
                              <input type="checkbox" className="mr-2" />
                              {duration}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    {t('courses.filters.resetButton')}
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="cursor-pointer">
                      {t('courses.sortby.newest')}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      {t('courses.sortby.popular')}
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer">
                      {t('courses.sortby.rating')}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {popularCourses.length} {t('courses.results')}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularCourses.map((course) => (
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
                
                <div className="mt-10 flex justify-center">
                  <Button>
                    {t('courses.loadMoreButton')}
                  </Button>
                </div>
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
