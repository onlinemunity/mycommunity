
import React from 'react';
import { Layout } from '@/components/Layout';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { TestimonialCard } from '@/components/ui-components/TestimonialCard';
import { FeatureCard } from '@/components/ui-components/FeatureCard';
import { PricingCard } from '@/components/ui-components/PricingCard';
import { Users, MessageSquare, Calendar, Award, Heart, Shield, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Academy = () => {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { profile } = useAuth();
  
  // Mock data for testimonials
  const testimonials = [
    {
      id: 1,
      name: 'Laura Schmidt',
      role: 'Community Member',
      image: '/placeholder.svg',
      quote: "Being part of this community has transformed my learning journey. The support and connections I've made are invaluable.",
      rating: 5,
    },
    {
      id: 2,
      name: 'Marco Perez',
      role: 'Premium Member',
      image: '/placeholder.svg',
      quote: "The community discussions and exclusive events have accelerated my growth. Totally worth the investment!",
      rating: 5,
    },
    {
      id: 3,
      name: 'Sophia Chen',
      role: 'Lifetime Member',
      image: '/placeholder.svg',
      quote: "As a lifetime member, I've seen this community evolve and grow. The value keeps increasing and the network is priceless.",
      rating: 5,
    }
  ];
  
  // Academy features
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
  
  // Mock data - pricing features
  const pricingFeatures = {
    yearly: [
      { text: "Access to all premium courses", included: true },
      { text: "Community forum access", included: true },
      { text: "Monthly expert webinars", included: true },
      { text: "Course completion certificates", included: true },
      { text: "Mentor support", included: true },
      { text: "Access to course source code", included: true },
    ],
    lifetime: [
      { text: "Everything in Yearly plan", included: true },
      { text: "Lifetime access to all content", included: true },
      { text: "Future course updates", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to new courses", included: true },
      { text: "Exclusive member events", included: true },
    ],
  };
  
  // Add pricing plans to cart
  const handleAddYearlyToCart = () => {
    addItem({
      id: 'yearly-membership',
      type: 'yearly_membership',
      name: 'Yearly Membership',
      description: 'Full access to all courses and resources for one year',
      price: 99
    });
  };
  
  const handleAddLifetimeToCart = () => {
    addItem({
      id: 'lifetime-membership',
      type: 'lifetime_membership',
      name: 'Lifetime Access',
      description: 'Permanent access to all courses and resources',
      price: 299
    });
  };
  
  // Check if user already has a membership
  const isBasic = !profile?.user_type || profile.user_type === 'basic';
  const isYearly = profile?.user_type === 'yearly';
  const isLifetime = profile?.user_type === 'lifetime';

  return (
    <Layout>
      <div className="page-transition">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-blue-50 py-20">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="heading-xl mb-6">
                <span className="text-gradient">
                  {t('academy.hero.title')}
                </span>
              </h1>
              <p className="body-lg mb-8 text-muted-foreground">
                {t('academy.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/courses">
                  <Button className="button-primary">
                    {t('academy.hero.joinButton')}
                  </Button>
                </Link>
                <Link to="#pricing">
                  <Button className="button-secondary">
                    View Membership Options
                  </Button>
                </Link>
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
        
        {/* Pricing Section */}
        <section id="pricing" className="section-padding bg-muted/30">
          <div className="container">
            <SectionHeading
              title="Membership Options"
              subtitle="Choose the plan that's right for your learning journey"
              align="center"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-10">
              <PricingCard
                title="Yearly Membership"
                description="Full access to all courses and resources for one year"
                price="$99"
                period="per year"
                features={pricingFeatures.yearly}
                ctaText={isYearly 
                  ? "Current Plan" 
                  : isLifetime 
                    ? "Downgrade" 
                    : "Subscribe Now"
                }
                ctaAction={handleAddYearlyToCart}
                highlighted={isYearly}
                badge={
                  <Badge className="bg-accent1 text-white py-1 px-3">
                    Most Popular
                  </Badge>
                }
              />
              <PricingCard
                title="Lifetime Access"
                description="One-time payment for unlimited lifetime access"
                price="$299"
                period="one-time payment"
                features={pricingFeatures.lifetime}
                ctaText={isLifetime ? "Current Plan" : "Get Lifetime Access"}
                ctaAction={handleAddLifetimeToCart}
                highlighted={isLifetime}
                badge={
                  <Badge className="bg-purple-600 text-white py-1 px-3">
                    Best Value
                  </Badge>
                }
              />
            </div>
            
            <div className="text-center mt-10">
              <Link to="/pricing">
                <Button variant="outline" className="flex items-center gap-2">
                  Compare All Plans
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials section */}
        <section className="section-padding bg-background">
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
                  author={testimonial.name}
                  role={testimonial.role}
                  quote={testimonial.quote}
                  avatar={testimonial.image}
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
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/courses">
                  <Button className="button-primary">
                    {t('community.cta.button')}
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="outline">
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Academy;
