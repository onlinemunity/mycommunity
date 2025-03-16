
import { ArrowRight, Book, HandHeart, Users } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/ui-components/SectionHeading";
import { FeatureCard } from "@/components/ui-components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

const About = () => {
  const { t } = useTranslation();

  // Team members data
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200",
      bio: "Sarah hat 15 Jahre Erfahrung im Bereich Community-Building und E-Learning.",
    },
    {
      name: "Michael Schmidt",
      role: "Head of Education",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200",
      bio: "Michael ist spezialisiert auf die Entwicklung innovativer Lernmethoden.",
    },
    {
      name: "Lisa Wang",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
      bio: "Lisa sorgt dafür, dass unsere Community lebendig und engagiert bleibt.",
    },
    {
      name: "David Müller",
      role: "Technical Lead",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
      bio: "David überwacht die technische Infrastruktur unserer Plattform.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-20 md:pb-20 bg-metal-light overflow-hidden">
        <div className="container-wide relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Badge className="badge-primary inline-flex mb-6">
              {t("about.title")}
            </Badge>
            <h1 className="heading-lg mb-6">
              {t("about.subtitle")}
            </h1>
            <p className="body-lg mb-0 text-muted-foreground">
              Wir verbinden Menschen durch Wissen und schaffen eine Umgebung für gemeinsames Wachstum und Lernen.
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-accent1/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent2/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <div className="glassmorphism rounded-2xl overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200&h=600" 
                alt="Our team collaborating" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="text-white p-6 md:p-8">
                  <Badge className="mb-4 bg-white/20 backdrop-blur-sm hover:bg-white/30">
                    Unsere Geschichte
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-display font-bold">
                    Von der Idee zur Community
                  </h2>
                </div>
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-6">
              <p>
                Unsere Geschichte begann 2018 mit einer einfachen Idee: Eine Plattform zu schaffen, die Menschen zusammenbringt, um gemeinsam zu lernen und zu wachsen. Was als kleine Online-Gruppe begann, hat sich zu einer blühenden Community entwickelt.
              </p>
              <p>
                Wir glauben daran, dass Lernen ein lebenslanger Prozess ist, der durch den Austausch mit anderen bereichert wird. Unsere Plattform wurde entwickelt, um diesen Austausch zu fördern und jedem Mitglied die Möglichkeit zu geben, sein volles Potenzial zu entfalten.
              </p>
              <p>
                Heute sind wir stolz darauf, tausende Mitglieder zu haben, die täglich voneinander lernen und sich gegenseitig inspirieren. Unsere Kurse werden von Experten aus verschiedenen Bereichen entwickelt, um sicherzustellen, dass die Inhalte relevant und von höchster Qualität sind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 md:py-24 bg-metal-light">
        <div className="container">
          <SectionHeading
            title={t("about.mission.title")}
            subtitle={t("about.mission.description")}
            badge={<Badge className="badge-primary">Unsere Werte</Badge>}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              icon={<Book className="h-6 w-6" />}
              title={t("about.values.learning.title")}
              description={t("about.values.learning.description")}
              delay={100}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title={t("about.values.community.title")}
              description={t("about.values.community.description")}
              delay={200}
            />
            <FeatureCard
              icon={<HandHeart className="h-6 w-6" />}
              title={t("about.values.quality.title")}
              description={t("about.values.quality.description")}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <SectionHeading
            title="Unser Team"
            subtitle="Die Menschen hinter unserer Community-Plattform"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={member.name}
                className="glassmorphism rounded-xl overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg">{member.name}</h3>
                  <p className="text-accent1 text-sm mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="pb-20 md:pb-32">
        <div className="container">
          <div className="max-w-4xl mx-auto rounded-2xl p-8 md:p-12 bg-gradient-to-br from-accent1/10 to-accent1/5 border border-accent1/20">
            <div className="text-center">
              <h2 className="heading-lg mb-4">
                Werde Teil unserer Community
              </h2>
              <p className="body-lg mb-8 text-muted-foreground max-w-2xl mx-auto">
                Entdecke, wie du von unserer Community profitieren und dein Wissen erweitern kannst. Wir freuen uns darauf, dich kennenzulernen.
              </p>
              <Button 
                size="lg" 
                className="group"
                asChild
              >
                <a href="/register">
                  Jetzt beitreten
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
