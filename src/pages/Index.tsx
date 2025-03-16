
import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, Users, MessageSquare, ChevronRight, Star } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/ui-components/SectionHeading";
import { FeatureCard } from "@/components/ui-components/FeatureCard";
import { TestimonialCard } from "@/components/ui-components/TestimonialCard";
import { PricingCard } from "@/components/ui-components/PricingCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

const Index = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  // Mock data - testimonials
  const testimonials = [
    {
      quote: "Diese Community hat mir geholfen, meine Fähigkeiten auf ein neues Level zu bringen. Die Kurse sind exzellent!",
      author: "Maria Schmidt",
      role: "Frontend Developer",
      rating: 5,
    },
    {
      quote: "Ich bin beeindruckt von der Qualität der Inhalte und der Unterstützung durch andere Community-Mitglieder.",
      author: "Thomas Weber",
      role: "Product Manager",
      rating: 5,
    },
    {
      quote: "Die Lifetime-Mitgliedschaft war die beste Investition in meine Karriere. Sehr empfehlenswert!",
      author: "Julia Becker",
      role: "UX Designer",
      rating: 5,
    },
  ];

  // Mock data - pricing features
  const pricingFeatures = {
    free: [
      { text: "Zugang zur Community", included: true },
      { text: "Basis-Kursinhalte", included: true },
      { text: "Forum-Zugang", included: true },
      { text: "Premium-Kurse", included: false },
      { text: "1:1 Mentoring", included: false },
      { text: "Exklusive Events", included: false },
    ],
    annual: [
      { text: "Zugang zur Community", included: true },
      { text: "Basis-Kursinhalte", included: true },
      { text: "Forum-Zugang", included: true },
      { text: "Premium-Kurse", included: true },
      { text: "1:1 Mentoring (2x/Monat)", included: true },
      { text: "Exklusive Events", included: false },
    ],
    lifetime: [
      { text: "Zugang zur Community", included: true },
      { text: "Basis-Kursinhalte", included: true },
      { text: "Forum-Zugang", included: true },
      { text: "Premium-Kurse", included: true },
      { text: "1:1 Mentoring (unbegrenzt)", included: true },
      { text: "Exklusive Events", included: true },
    ],
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="container-wide relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Badge className="badge-primary inline-flex mb-6">
              Community & Learning Platform
            </Badge>
            <h1 className="heading-xl mb-6">
              {t("homepage.hero.title")}
            </h1>
            <p className="body-lg mb-8 text-muted-foreground">
              {t("homepage.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="button-primary text-base"
                asChild
              >
                <Link to="/register">
                  {t("homepage.hero.cta")}
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base"
                asChild
              >
                <Link to="/community">
                  {t("common.learnMore")}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-accent1/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent2/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-metal-light">
        <div className="container">
          <SectionHeading
            title={t("homepage.features.title")}
            subtitle={t("homepage.features.subtitle")}
            badge={<Badge className="badge-primary">{t("common.readMore")}</Badge>}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title={t("homepage.features.community.title")}
              description={t("homepage.features.community.description")}
              delay={100}
            />
            <FeatureCard
              icon={<Book className="h-6 w-6" />}
              title={t("homepage.features.courses.title")}
              description={t("homepage.features.courses.description")}
              delay={200}
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title={t("homepage.features.discussions.title")}
              description={t("homepage.features.discussions.description")}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding">
        <div className="container">
          <SectionHeading
            title={t("homepage.testimonials.title")}
            subtitle={t("homepage.testimonials.subtitle")}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                rating={testimonial.rating}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding bg-metal-light">
        <div className="container">
          <SectionHeading
            title={t("homepage.pricing.title")}
            subtitle={t("homepage.pricing.subtitle")}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            <PricingCard
              title={t("homepage.pricing.plans.free.title")}
              description={t("homepage.pricing.plans.free.description")}
              price={t("homepage.pricing.plans.free.price")}
              period={t("homepage.pricing.plans.free.period")}
              features={pricingFeatures.free}
              ctaText={t("homepage.pricing.plans.free.cta")}
              ctaAction={() => {}}
              delay={100}
            />
            <PricingCard
              title={t("homepage.pricing.plans.annual.title")}
              description={t("homepage.pricing.plans.annual.description")}
              price={t("homepage.pricing.plans.annual.price")}
              period={t("homepage.pricing.plans.annual.period")}
              features={pricingFeatures.annual}
              ctaText={t("homepage.pricing.plans.annual.cta")}
              ctaAction={() => {}}
              highlighted={true}
              badge={
                <Badge className="bg-accent1 text-white py-1 px-3">
                  Popular
                </Badge>
              }
              delay={200}
            />
            <PricingCard
              title={t("homepage.pricing.plans.lifetime.title")}
              description={t("homepage.pricing.plans.lifetime.description")}
              price={t("homepage.pricing.plans.lifetime.price")}
              period={t("homepage.pricing.plans.lifetime.period")}
              features={pricingFeatures.lifetime}
              ctaText={t("homepage.pricing.plans.lifetime.cta")}
              ctaAction={() => {}}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container max-w-4xl">
          <div className="text-center rounded-2xl p-8 md:p-12 glassmorphism animate-fade-in">
            <h2 className="heading-lg mb-4">
              {t("homepage.cta.title")}
            </h2>
            <p className="body-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
              {t("homepage.cta.description")}
            </p>
            <Button 
              size="lg" 
              className="button-primary"
              asChild
            >
              <Link to="/register">
                {t("homepage.cta.button")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
