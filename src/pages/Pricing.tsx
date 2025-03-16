
import React from 'react';
import { Layout } from '@/components/Layout';
import { PricingCard } from '@/components/ui-components/PricingCard';
import { SectionHeading } from '@/components/ui-components/SectionHeading';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define type for pricing features
interface PricingFeature {
  feature: string;
  included: boolean;
}

// Define type for pricing tier
interface PricingTier {
  title: string;
  price: {
    monthly: string;
    annual: string;
  };
  description: string;
  features: PricingFeature[];
  buttonText: string;
  popular?: boolean;
}

const Pricing = () => {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');
  
  // Pricing tiers data
  const pricingTiers: PricingTier[] = [
    {
      title: t('pricing.tiers.free.title') || "Free",
      price: {
        monthly: t('pricing.tiers.free.price.monthly') || "$0",
        annual: t('pricing.tiers.free.price.annual') || "$0",
      },
      description: t('pricing.tiers.free.description') || "Basic access to community resources",
      features: [
        { feature: t('pricing.features.forums') || "Access to community forums", included: true },
        { feature: t('pricing.features.resources') || "Basic learning resources", included: true },
        { feature: t('pricing.features.events') || "Public community events", included: true },
        { feature: t('pricing.features.courses') || "Limited course access", included: false },
        { feature: t('pricing.features.support') || "Priority support", included: false },
        { feature: t('pricing.features.projects') || "Team projects", included: false },
      ],
      buttonText: t('pricing.tiers.free.button') || "Get Started",
    },
    {
      title: t('pricing.tiers.pro.title') || "Pro",
      price: {
        monthly: t('pricing.tiers.pro.price.monthly') || "$29",
        annual: t('pricing.tiers.pro.price.annual') || "$290",
      },
      description: t('pricing.tiers.pro.description') || "Full access to all courses and resources",
      features: [
        { feature: t('pricing.features.forums') || "Access to community forums", included: true },
        { feature: t('pricing.features.resources') || "Basic learning resources", included: true },
        { feature: t('pricing.features.events') || "Public community events", included: true },
        { feature: t('pricing.features.courses') || "Limited course access", included: true },
        { feature: t('pricing.features.support') || "Priority support", included: true },
        { feature: t('pricing.features.projects') || "Team projects", included: false },
      ],
      buttonText: t('pricing.tiers.pro.button') || "Upgrade Now",
      popular: true,
    },
    {
      title: t('pricing.tiers.business.title') || "Business",
      price: {
        monthly: t('pricing.tiers.business.price.monthly') || "$79",
        annual: t('pricing.tiers.business.price.annual') || "$790",
      },
      description: t('pricing.tiers.business.description') || "Enterprise-level solutions for teams",
      features: [
        { feature: t('pricing.features.forums') || "Access to community forums", included: true },
        { feature: t('pricing.features.resources') || "Basic learning resources", included: true },
        { feature: t('pricing.features.events') || "Public community events", included: true },
        { feature: t('pricing.features.courses') || "Limited course access", included: true },
        { feature: t('pricing.features.support') || "Priority support", included: true },
        { feature: t('pricing.features.projects') || "Team projects", included: true },
      ],
      buttonText: t('pricing.tiers.business.button') || "Contact Sales",
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: t('pricing.faq.q1') || "How does the billing work?",
      answer: t('pricing.faq.a1') || "We offer both monthly and annual billing cycles. Annual billing comes with a 15% discount compared to monthly billing."
    },
    {
      question: t('pricing.faq.q2') || "Can I change plans later?",
      answer: t('pricing.faq.a2') || "Yes, you can upgrade or downgrade your plan at any time. The billing will be prorated accordingly."
    },
    {
      question: t('pricing.faq.q3') || "What payment methods do you accept?",
      answer: t('pricing.faq.a3') || "We accept all major credit cards, PayPal, and bank transfers for business accounts."
    },
  ];

  return (
    <Layout>
      <div className="page-transition">
        <section className="py-20">
          <div className="container-wide">
            <SectionHeading
              title={t('pricing.hero.title') || "Simple, transparent pricing"}
              subtitle={t('pricing.hero.subtitle') || "Choose the plan that best fits your needs"}
              align="center"
            />
            
            <div className="mt-8 flex justify-center">
              <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as 'monthly' | 'annual')}>
                <TabsList>
                  <TabsTrigger value="monthly">{t('pricing.billing.monthly') || "Monthly"}</TabsTrigger>
                  <TabsTrigger value="annual">
                    {t('pricing.billing.annual') || "Annual"}
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                      15% {t('pricing.billing.discount') || "off"}
                    </span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {pricingTiers.map((tier, i) => (
                <PricingCard
                  key={i}
                  title={tier.title}
                  price={billingCycle === 'monthly' ? tier.price.monthly : tier.price.annual}
                  description={tier.description}
                  features={tier.features}
                  buttonText={tier.buttonText}
                  popular={tier.popular}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="container-wide">
            <SectionHeading
              title={t('pricing.faq.title') || "Frequently Asked Questions"}
              subtitle={t('pricing.faq.subtitle') || "Find answers to common questions about our pricing and plans"}
              align="center"
            />

            <div className="mt-12 max-w-3xl mx-auto divide-y">
              {faqs.map((faq, i) => (
                <div key={i} className="py-6">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Pricing;
