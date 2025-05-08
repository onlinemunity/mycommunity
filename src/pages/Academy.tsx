
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/use-toast';

const academyFeatures = [
  { text: "Full Access to ALL Courses", basic: false, premium: true, pro: true },
  { text: "Community Forum Access", basic: true, premium: true, pro: true },
  { text: "Mentor Support", basic: false, premium: true, pro: true },
  { text: "Project Reviews", basic: false, premium: true, pro: true },
  { text: "Certificate of Completion", basic: false, premium: true, pro: true },
  { text: "Live Sessions & Workshops", basic: false, premium: false, pro: true },
  { text: "Priority Support", basic: false, premium: false, pro: true },
  { text: "Career Guidance", basic: false, premium: false, pro: true },
];

const Academy = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const isAuthenticated = !!user;
  const userPlan = profile?.user_type || 'basic';

  const handlePurchasePremium = () => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=academy');
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with your membership purchase.",
      });
      return;
    }
    
    addItem({
      id: 'premium-membership',
      type: 'premium_membership',
      name: 'Premium Membership',
      description: 'Full access to all courses and resources for one year',
      price: 99
    });
    
    navigate('/cart');
    
    toast({
      title: "Added to cart",
      description: "Premium membership has been added to your cart.",
    });
  };
  
  const handlePurchasePro = () => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=academy');
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with your membership purchase.",
      });
      return;
    }
    
    addItem({
      id: 'pro-membership',
      type: 'pro_membership',
      name: 'Pro Membership',
      description: 'Full access to all courses, resources and live events',
      price: 299
    });
    
    navigate('/cart');
    
    toast({
      title: "Added to cart",
      description: "Pro membership has been added to your cart.",
    });
  };

  const isPremium = userPlan === 'premium';
  const isPro = userPlan === 'pro';

  return (
    <Layout>
      <div className="page-transition">
        <div className="bg-gradient-to-b from-accent2/5 to-accent1/5 py-16 md:py-32">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4">Premium Learning</Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Unlock Your Full Learning Potential
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Get unlimited access to all premium courses, resources, and expert mentorship to accelerate your learning journey.
                </p>
                {!isPremium && !isPro && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      size="lg" 
                      className="button-primary"
                      onClick={handlePurchasePremium}
                    >
                      Become a Premium Member
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="secondary"
                      onClick={handlePurchasePro}
                    >
                      Go Pro
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
                {(isPremium || isPro) && (
                  <div>
                    <Button 
                      size="lg" 
                      className="button-primary"
                      onClick={() => navigate('/dashboard/courses')}
                    >
                      Access Your Premium Courses
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="relative">
                <AspectRatio ratio={16/9} className="rounded-xl overflow-hidden shadow-2xl border">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
                    alt="Academy learning experience"
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <div className="absolute -bottom-6 -right-6 rounded-lg bg-background py-2 px-4 shadow-lg border">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium ml-1">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-16 md:py-24">
          <SectionHeading
            title="Choose Your Membership Level"
            subtitle="Different plans for different learning needs"
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Basic Plan */}
            <Card className={`border ${userPlan === 'basic' ? 'border-accent1' : ''}`}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Basic</span>
                  <span className="text-2xl font-bold">Free</span>
                </CardTitle>
                <CardDescription>Community access & basic courses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {academyFeatures.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-2 ${!feature.basic ? 'text-muted-foreground' : ''}`}
                  >
                    {feature.basic ? (
                      <Check className="h-4 w-4 mt-1 text-emerald-500" />
                    ) : (
                      <span className="h-4 w-4 mt-1 block"></span>
                    )}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                {userPlan === 'basic' ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline">
                    Downgrade to Basic
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className={`border ${userPlan === 'premium' ? 'border-accent1' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Most Popular</Badge>
                  <span className="text-2xl font-bold">$99</span>
                </div>
                <CardTitle>Premium</CardTitle>
                <CardDescription>Full access to all courses & mentoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {academyFeatures.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-2 ${!feature.premium ? 'text-muted-foreground' : ''}`}
                  >
                    {feature.premium ? (
                      <Check className="h-4 w-4 mt-1 text-emerald-500" />
                    ) : (
                      <span className="h-4 w-4 mt-1 block"></span>
                    )}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                {userPlan === 'premium' ? (
                  <Button className="w-full" variant="default" disabled>
                    Current Plan
                  </Button>
                ) : isPro ? (
                  <Button className="w-full" variant="default" onClick={handlePurchasePremium}>
                    Downgrade to Premium
                  </Button>
                ) : (
                  <Button className="w-full" variant="default" onClick={handlePurchasePremium}>
                    Get Premium Access
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className={`border ${userPlan === 'pro' ? 'border-accent1' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <Badge variant="default">Best Value</Badge>
                  <span className="text-2xl font-bold">$299</span>
                </div>
                <CardTitle>Pro</CardTitle>
                <CardDescription>Everything plus live events & priority support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {academyFeatures.map((feature, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-2 ${!feature.pro ? 'text-muted-foreground' : ''}`}
                  >
                    {feature.pro ? (
                      <Check className="h-4 w-4 mt-1 text-emerald-500" />
                    ) : (
                      <span className="h-4 w-4 mt-1 block"></span>
                    )}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                {userPlan === 'pro' ? (
                  <Button className="w-full" variant="secondary" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full" variant="secondary" onClick={handlePurchasePro}>
                    Get Pro Access
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Academy;
