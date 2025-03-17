
import React from 'react';
import { Layout } from '@/components/Layout';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { PricingCard } from '@/components/ui-components/PricingCard';
import { Check } from 'lucide-react';

interface PricingFeature {
  text: string;
  available: boolean;
}

interface PricingPlan {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  cta: string;
  popular?: boolean;
}

const Pricing = () => {
  const pricingPlans: PricingPlan[] = [
    {
      title: 'Free',
      price: '$0',
      description: 'Basic access to community resources',
      features: [
        { text: 'Access to community forum', available: true },
        { text: 'Read-only access to learning resources', available: true },
        { text: 'Limited course previews', available: true },
        { text: 'Community support', available: true },
        { text: 'Course completion certificates', available: false },
        { text: 'Unlimited access to all courses', available: false },
        { text: 'Mentor support', available: false },
        { text: 'Project reviews', available: false },
        { text: 'Career coaching', available: false },
      ],
      cta: 'Get Started',
    },
    {
      title: 'Pro',
      price: '$29',
      description: 'Full access to all courses and community features',
      features: [
        { text: 'Access to community forum', available: true },
        { text: 'Full access to learning resources', available: true },
        { text: 'Unlimited course access', available: true },
        { text: 'Community support', available: true },
        { text: 'Course completion certificates', available: true },
        { text: 'Access to project repositories', available: true },
        { text: 'Mentor support', available: true },
        { text: 'Project reviews', available: false },
        { text: 'Career coaching', available: false },
      ],
      cta: 'Subscribe Now',
      popular: true,
    },
    {
      title: 'Enterprise',
      price: '$99',
      description: 'Advanced features for professional development',
      features: [
        { text: 'Everything in Pro plan', available: true },
        { text: 'Team management dashboard', available: true },
        { text: 'Custom learning paths', available: true },
        { text: 'Advanced analytics', available: true },
        { text: 'Dedicated account manager', available: true },
        { text: 'Private mentorship sessions', available: true },
        { text: 'Custom course creation', available: true },
        { text: 'Project reviews', available: true },
        { text: 'Career coaching', available: true },
      ],
      cta: 'Contact Sales',
    },
  ];

  const featuredFeatures = [
    {
      title: 'Community Access',
      description: 'Join our thriving community of developers and learners',
      icon: <Check className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with real-world experience',
      icon: <Check className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Hands-on Projects',
      description: 'Build your portfolio with practical, real-world projects',
      icon: <Check className="h-5 w-5 text-primary" />,
    },
    {
      title: 'Career Support',
      description: 'Get guidance and resources to advance your career',
      icon: <Check className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <Layout>
      <div className="page-transition container py-12 md:py-24">
        <SectionHeading
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that's right for you"
          center
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {pricingPlans.map((plan, i) => (
            <PricingCard key={i} plan={plan} />
          ))}
        </div>

        <div className="mt-24">
          <SectionHeading
            title="Everything You Need to Succeed"
            subtitle="All plans include these essential features"
            center
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {featuredFeatures.map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
                <div className="rounded-full bg-primary/10 p-3 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;
