
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: "Community",
    links: [
      { label: "Features", href: "/community" },
      { label: "Membership", href: "/pricing" },
      { label: "Rules", href: "/rules" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Courses",
    links: [
      { label: "All Courses", href: "/courses" },
      { label: "Categories", href: "/courses#categories" },
      { label: "For Teams", href: "/teams" },
      { label: "Become an Instructor", href: "/teach" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Imprint", href: "/imprint" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

interface LayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  withPadding?: boolean;
}

export const Layout = ({
  children,
  className,
  fullWidth = false,
  withPadding = true,
}: LayoutProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main 
        className={cn(
          "flex-1 pt-20",
          withPadding && "pb-16 md:pb-24",
          className
        )}
      >
        {children}
      </main>

      <footer className="bg-metal-light border-t border-metal/30">
        <div className={`${fullWidth ? 'container-wide' : 'container'} py-12 md:py-16`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-display font-semibold text-sm mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-metal/30 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-accent1 to-accent1-light flex items-center justify-center shadow-sm">
                <span className="font-display text-white text-sm font-bold">C</span>
              </div>
              <span className="ml-2 font-display font-bold">Community</span>
            </div>
            
            <div className="text-sm text-foreground/60">
              &copy; {currentYear} Community Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
