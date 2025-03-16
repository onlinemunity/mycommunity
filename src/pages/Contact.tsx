
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const ContactPage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: t("contact.form.success"),
        variant: "default",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: t("contact.form.error"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 text-accent1" />,
      title: t("contact.info.email"),
      content: "support@communityplatform.com",
    },
    {
      icon: <Phone className="h-5 w-5 text-accent1" />,
      title: t("contact.info.phone"),
      content: "+1 (555) 123-4567",
    },
    {
      icon: <MapPin className="h-5 w-5 text-accent1" />,
      title: t("contact.info.address"),
      content: "123 Community Street, Digital City",
    },
    {
      icon: <Clock className="h-5 w-5 text-accent1" />,
      title: t("contact.info.hours"),
      content: "Mon-Fri: 9AM-5PM (UTC)",
    },
  ];

  return (
    <Layout>
      <div className="container py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <div className="bg-white dark:bg-metal rounded-xl shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  {t("contact.form.name")}
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t("contact.form.email")}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  {t("contact.form.subject")}
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t("contact.form.message")}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("common.loading") : t("contact.form.submit")}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl font-display font-semibold mb-6">
              {t("contact.info.title")}
            </h2>
            
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-metal/10 rounded-lg p-3">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <p className="text-foreground/70">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-metal/5 rounded-lg border border-metal/20">
              <h3 className="font-medium mb-2">{t("common.joinNow")}</h3>
              <p className="text-sm text-foreground/70 mb-4">
                {t("community.join.description")}
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/auth">{t("common.signUp")}</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
