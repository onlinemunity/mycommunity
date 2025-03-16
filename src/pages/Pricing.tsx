
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Check } from "lucide-react";
import { PricingCard } from "@/components/ui-components/PricingCard";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const PricingPage = () => {
  const { t } = useTranslation();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const handleToggleBilling = () => {
    setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly");
  };

  const pricingPlans = [
    {
      title: t("homepage.pricing.plans.free.title"),
      description: t("homepage.pricing.plans.free.description"),
      price: t("homepage.pricing.plans.free.price"),
      period: t("homepage.pricing.plans.free.period"),
      features: [
        "Access to community forums",
        "Basic courses catalog",
        "Public discussions",
        "Community events calendar"
      ],
      cta: t("homepage.pricing.plans.free.cta"),
      ctaLink: "/auth",
      popular: false
    },
    {
      title: t("homepage.pricing.plans.annual.title"),
      description: t("homepage.pricing.plans.annual.description"),
      price: billingCycle === "monthly" ? "$12" : t("homepage.pricing.plans.annual.price"),
      period: billingCycle === "monthly" ? t("common.perMonth") : t("homepage.pricing.plans.annual.period"),
      features: [
        "Everything in Free plan",
        "Unlimited course access",
        "Private discussion groups",
        "Networking opportunities",
        "Mentorship access",
        "Exclusive webinars"
      ],
      cta: t("homepage.pricing.plans.annual.cta"),
      ctaLink: "/auth",
      popular: true
    },
    {
      title: t("homepage.pricing.plans.lifetime.title"),
      description: t("homepage.pricing.plans.lifetime.description"),
      price: t("homepage.pricing.plans.lifetime.price"),
      period: t("homepage.pricing.plans.lifetime.period"),
      features: [
        "Everything in Annual plan",
        "Lifetime access to all content",
        "Priority support",
        "Early access to new features",
        "Exclusive community events",
        "Personal coaching session"
      ],
      cta: t("homepage.pricing.plans.lifetime.cta"),
      ctaLink: "/auth",
      popular: false
    }
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access until the end of your billing period."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and in some regions, bank transfers. All payments are processed securely."
    },
    {
      question: "Is there a free trial available?",
      answer: "We offer a free tier that gives you access to basic features. This allows you to explore our platform before deciding to upgrade."
    },
    {
      question: "How do refunds work?",
      answer: "If you're not satisfied with your purchase, contact us within 14 days for a full refund. Lifetime purchases have a 30-day money-back guarantee."
    },
    {
      question: "Can I switch between plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated amount for the remainder of your billing cycle."
    }
  ];

  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {t("homepage.pricing.title")}
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            {t("homepage.pricing.subtitle")}
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center justify-center border border-metal/20 rounded-full p-1 bg-metal/5">
            <span className={cn(
              "px-4 py-2 text-sm rounded-full transition-all",
              billingCycle === "monthly" 
                ? "text-foreground/70" 
                : "bg-white text-accent1 font-medium shadow-sm"
            )}>
              Annual
            </span>
            <Switch 
              checked={billingCycle === "monthly"}
              onCheckedChange={handleToggleBilling}
              className="mx-2"
            />
            <span className={cn(
              "px-4 py-2 text-sm rounded-full transition-all",
              billingCycle === "monthly" 
                ? "bg-white text-accent1 font-medium shadow-sm" 
                : "text-foreground/70"
            )}>
              Monthly
            </span>
          </div>
          
          {billingCycle === "yearly" && (
            <div className="mt-3 text-sm text-accent1 font-medium">
              Save 25% with annual billing
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              title={plan.title}
              description={plan.description}
              price={plan.price}
              period={plan.period}
              features={plan.features}
              ctaLabel={plan.cta}
              ctaHref={plan.ctaLink}
              popular={plan.popular}
            />
          ))}
        </div>
        
        {/* FAQs */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl font-display font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-metal/20 rounded-lg p-6 bg-card">
                <h3 className="font-medium text-lg mb-2">{faq.question}</h3>
                <p className="text-foreground/70">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Final CTA */}
        <div className="mt-20 text-center bg-metal/5 border border-metal/20 rounded-xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            {t("homepage.cta.title")}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            {t("homepage.cta.description")}
          </p>
          <Button size="lg" asChild>
            <a href="/auth">{t("homepage.cta.button")}</a>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PricingPage;
