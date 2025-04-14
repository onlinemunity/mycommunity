import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { PricingCard } from '@/components/ui-components/PricingCard';
import { Check, Lock, User, Star, Calendar, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '@/types/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  planType: 'basic' | 'yearly' | 'lifetime';
}

const Pricing = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleSelectPlan = async (planType: 'basic' | 'yearly' | 'lifetime') => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    // For free plan, apply directly
    if (planType === 'basic') {
      try {
        // Add code to handle downgrade to basic plan if needed
        toast({
          title: "Basic plan selected",
          description: "You've selected the basic plan.",
        });
      } catch (error: any) {
        toast({
          title: "Error selecting plan",
          description: error.message || "There was an error selecting the plan.",
          variant: "destructive",
        });
      }
      return;
    }

    // For paid plans, add to cart
    const priceMap = {
      yearly: 99,
      lifetime: 299
    };

    const cartItem: CartItem = {
      id: planType,
      name: planType === 'yearly' ? 'Yearly Membership' : 'Lifetime Access',
      description: planType === 'yearly' 
        ? 'Full access to all courses and resources for one year' 
        : 'Lifetime access to all courses and resources',
      price: priceMap[planType],
      type: `${planType}_membership`
    };

    addItem(cartItem);
    
    // Show success toast
    toast({
      title: "Added to cart",
      description: `${cartItem.name} has been added to your cart.`,
    });
    
    // Navigate to cart
    navigate('/cart');
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
        { text: 'Live events and sessions', available: false },
      ],
      cta: 'Get Started',
      planType: 'basic',
    },
    {
      title: 'Yearly Membership',
      price: '$99',
      description: 'Full access to all courses and live events',
      features: [
        { text: 'Access to community forum', available: true },
        { text: 'Full access to learning resources', available: true },
        { text: 'Access to ALL courses (Basic & Premium)', available: true },
        { text: 'Community support', available: true },
        { text: 'Course completion certificates', available: true },
        { text: 'Access to project repositories', available: true },
        { text: 'Mentor support', available: true },
        { text: 'Project reviews', available: true },
        { text: 'Live events and sessions', available: true },
      ],
      cta: 'Subscribe Yearly',
      popular: true,
      planType: 'yearly',
    },
    {
      title: 'Lifetime Access',
      price: '$299',
      description: 'Permanent access to all courses',
      features: [
        { text: 'Access to community forum', available: true },
        { text: 'Full access to learning resources', available: true },
        { text: 'Access to ALL courses (Basic & Premium)', available: true },
        { text: 'Community support', available: true },
        { text: 'Course completion certificates', available: true },
        { text: 'Access to project repositories', available: true },
        { text: 'Mentor support', available: true },
        { text: 'Project reviews', available: true },
        { text: 'Live events and sessions', available: false },
      ],
      cta: 'Get Lifetime Access',
      planType: 'lifetime',
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

  const mapPlanToCardProps = (plan: PricingPlan, index: number) => {
    const mappedFeatures = plan.features.map(feature => ({
      text: feature.text,
      included: feature.available
    }));

    const isCurrentPlan = profile?.user_type === plan.planType;
    
    let ctaText = plan.cta;
    let ctaAction = async () => handleSelectPlan(plan.planType);
    let ctaDisabled = false;
    
    if (isCurrentPlan) {
      ctaText = 'Current Plan';
      ctaAction = async () => {};
      ctaDisabled = true;
    } else if (plan.planType !== 'basic') {
      ctaText = `Add to Cart`;
    }

    let badge = null;
    if (plan.planType === 'yearly') {
      badge = (
        <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
          Most Popular
        </span>
      );
    } else if (plan.planType === 'lifetime') {
      badge = (
        <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
          Best Value
        </span>
      );
    }

    return {
      key: index,
      title: plan.title,
      description: plan.description,
      price: plan.price,
      period: plan.planType === 'yearly' ? "per year" : plan.planType === 'basic' ? "free forever" : "one-time payment",
      features: mappedFeatures,
      ctaText: ctaText,
      ctaAction: ctaAction,
      ctaDisabled: ctaDisabled,
      highlighted: plan.popular || isCurrentPlan,
      badge: badge,
      delay: index * 100,
      ctaIcon: plan.planType !== 'basic' && !isCurrentPlan ? <ShoppingCart className="h-4 w-4 mr-2" /> : undefined
    };
  };

  const formatExpirationDate = (dateString?: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
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
                  {profile.user_type === 'lifetime' ? (
                    <>
                      Lifetime Access
                      <Star className="h-4 w-4 text-purple-500 ml-1 inline" />
                    </>
                  ) : profile.user_type === 'yearly' ? (
                    <>
                      Yearly Membership
                      <Star className="h-4 w-4 text-emerald-500 ml-1 inline" />
                    </>
                  ) : 'Basic'}
                </p>
                {profile.user_type === 'yearly' && profile.membership_expires_at && (
                  <p className="text-xs text-muted-foreground flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expires: {formatExpirationDate(profile.membership_expires_at)}
                  </p>
                )}
              </div>
            </div>
            {(profile.user_type === 'yearly' || profile.user_type === 'lifetime') && (
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

        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Sign in Required</DialogTitle>
              <DialogDescription>
                You need to be signed in to select a membership plan.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowLoginDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowLoginDialog(false);
                  navigate('/auth?redirect=pricing');
                }}
              >
                Sign in
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Pricing;
