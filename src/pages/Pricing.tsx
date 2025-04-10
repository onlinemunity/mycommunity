
import React from 'react';
import { Layout } from '@/components/Layout';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { PricingCard } from '@/components/ui-components/PricingCard';
import { Check, Lock, User, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  planType: 'basic' | 'premium';
}

const Pricing = () => {
  const { user, profile, refreshProfile } = useAuth();

  const handleUpgrade = async (planType: 'basic' | 'premium') => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upgrade your plan",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: planType })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh user profile to get the updated information
      await refreshProfile();

      toast({
        title: `Upgraded to ${planType.charAt(0).toUpperCase() + planType.slice(1)}!`,
        description: `Your account has been successfully upgraded to the ${planType} plan.`,
      });
    } catch (error: any) {
      toast({
        title: "Upgrade failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const pricingPlans: PricingPlan[] = [
    {
      title: 'Basic',
      price: '$0',
      description: 'Basic access to community resources',
      features: [
        { text: 'Access to community forum', available: true },
        { text: 'Read-only access to learning resources', available: true },
        { text: 'Access to basic courses only', available: true },
        { text: 'Community support', available: true },
        { text: 'Course completion certificates', available: false },
        { text: 'Access to premium courses', available: false },
        { text: 'Mentor support', available: false },
        { text: 'Project reviews', available: false },
        { text: 'Career coaching', available: false },
      ],
      cta: 'Get Started',
      planType: 'basic',
    },
    {
      title: 'Premium',
      price: '$29',
      description: 'Full access to all courses and community features',
      features: [
        { text: 'Access to community forum', available: true },
        { text: 'Full access to learning resources', available: true },
        { text: 'Access to ALL courses (Basic & Premium)', available: true },
        { text: 'Community support', available: true },
        { text: 'Course completion certificates', available: true },
        { text: 'Access to project repositories', available: true },
        { text: 'Mentor support', available: true },
        { text: 'Project reviews', available: false },
        { text: 'Career coaching', available: false },
      ],
      cta: 'Subscribe Now',
      popular: true,
      planType: 'premium',
    },
    {
      title: 'Enterprise',
      price: '$99',
      description: 'Advanced features for professional development',
      features: [
        { text: 'Everything in Premium plan', available: true },
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
      planType: 'premium',
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

  // Helper function to map our PricingPlan format to PricingCard props
  const mapPlanToCardProps = (plan: PricingPlan, index: number) => {
    // Convert our features to the format expected by PricingCard
    const mappedFeatures = plan.features.map(feature => ({
      text: feature.text,
      included: feature.available
    }));

    // Determine if this is the user's current plan
    const isCurrentPlan = profile?.user_type === plan.planType;
    
    // Determine CTA text and action based on user status
    let ctaText = plan.cta;
    let ctaAction = () => handleUpgrade(plan.planType);
    let ctaDisabled = false;
    
    if (isCurrentPlan) {
      ctaText = 'Current Plan';
      ctaAction = () => {};
      ctaDisabled = true;
    } else if (plan.title === 'Enterprise') {
      ctaText = 'Contact Sales';
      ctaAction = () => window.location.href = '/contact';
      ctaDisabled = false;
    }

    return {
      key: index,
      title: plan.title,
      description: plan.description,
      price: plan.price,
      period: "per month",
      features: mappedFeatures,
      ctaText: ctaText,
      ctaAction: ctaAction,
      ctaDisabled: ctaDisabled,
      highlighted: plan.popular || isCurrentPlan,
      delay: index * 100
    };
  };

  return (
    <Layout>
      <div className="page-transition container py-12 md:py-24">
        <SectionHeading
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that's right for you"
          align="center"
        />

        {profile && (
          <div className="max-w-md mx-auto mb-12 bg-muted/30 rounded-lg p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-muted rounded-full p-3">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your current plan</p>
                <p className="font-semibold flex items-center">
                  {profile.user_type === 'premium' ? (
                    <>
                      Premium 
                      <Star className="h-4 w-4 text-amber-500 ml-1 inline" />
                    </>
                  ) : 'Basic'}
                </p>
              </div>
            </div>
            {profile.user_type === 'premium' && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {pricingPlans.map((plan, i) => (
            <PricingCard {...mapPlanToCardProps(plan, i)} key={i} />
          ))}
        </div>

        <div className="mt-24">
          <SectionHeading
            title="Everything You Need to Succeed"
            subtitle="All plans include these essential features"
            align="center"
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
