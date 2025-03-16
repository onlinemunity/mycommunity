
import React from 'react';
import { Layout } from '@/components/Layout';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { TestimonialCard } from '@/components/ui-components/TestimonialCard';
import { FeatureCard } from '@/components/ui-components/FeatureCard';
import { Users, MessageSquare, Calendar, Award, Heart, Shield } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Community = () => {
  const { t } = useTranslation();
  
  // Mock data for testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Laura Schmidt',
      role: 'Community Member',
      image: '/placeholder.svg',
      text: 'Being part of this community has transformed my learning journey. The support and connections I've made are invaluable.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Marco Perez',
      role: 'Premium Member',
      image: '/placeholder.svg',
      text: 'The community discussions and exclusive events have accelerated my growth. Totally worth the investment!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Sophia Chen',
      role: 'Lifetime Member',
      image: '/placeholder.svg',
      text: 'As a lifetime member, I've seen this community evolve and grow. The value keeps increasing and the network is priceless.',
      rating: 5,
    }
  ];
  
  // Community features
  const features = [
    {
      icon: <Users size={24} />,
      title: t('community.features.networking.title'),
      description: t('community.features.networking.description'),
    },
    {
      icon: <MessageSquare size={24} />,
      title: t('community.features.discussions.title'),
      description: t('community.features.discussions.description'),
    },
    {
      icon: <Calendar size={24} />,
      title: t('community.features.events.title'),
      description: t('community.features.events.description'),
    },
    {
      icon: <Award size={24} />,
      title: t('community.features.exclusiveContent.title'),
      description: t('community.features.exclusiveContent.description'),
    },
    {
      icon: <Heart size={24} />,
      title: t('community.features.support.title'),
      description: t('community.features.support.description'),
    },
    {
      icon: <Shield size={24} />,
      title: t('community.features.lifetime.title'),
      description: t('community.features.lifetime.description'),
    }
  ];

  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-blue-50 py-20">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="heading-xl mb-6">
                <span className="text-gradient">
                  {t('community.hero.title')}
                </span>
              </h1>
              <p className="body-lg mb-8 text-muted-foreground">
                {t('community.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button className="button-primary">
                  {t('community.hero.joinButton')}
                </button>
                <button className="button-secondary">
                  {t('community.hero.learnMoreButton')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-background">
          <div className="container-wide">
            <SectionHeading
              title={t('community.features.title')}
              subtitle={t('community.features.subtitle')}
              align="center"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials section */}
        <section className="section-padding bg-muted/30">
          <div className="container-wide">
            <SectionHeading
              title={t('community.testimonials.title')}
              subtitle={t('community.testimonials.subtitle')}
              align="center"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.name}
                  role={testimonial.role}
                  text={testimonial.text}
                  image={testimonial.image}
                  rating={testimonial.rating}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-accent1/10 to-accent2/10">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-lg mb-6">
                {t('community.cta.title')}
              </h2>
              <p className="body-lg mb-8 text-muted-foreground">
                {t('community.cta.subtitle')}
              </p>
              <button className="button-primary">
                {t('community.cta.button')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Community;
