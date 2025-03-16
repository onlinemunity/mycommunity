
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, profile, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation items
  const navItems = [
    { name: t("navigation.home"), path: "/" },
    { name: t("navigation.about"), path: "/about" },
    { name: t("navigation.community"), path: "/community" },
    { name: t("navigation.courses"), path: "/courses" },
  ];

  // Update scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isScrolled
          ? "py-2 bg-white/90 backdrop-blur-md shadow-sm"
          : "py-4 bg-transparent"
      )}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent1 to-accent1-light flex items-center justify-center shadow-sm">
            <span className="font-display text-white text-lg font-bold">C</span>
          </div>
          <span className="font-display font-bold text-xl hidden sm:block">Community</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.path
                  ? "text-accent1 bg-accent1/5"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary/80"
              )}
            >
              {item.name}
            </Link>
          ))}
          {user && (
            <Link
              to="/dashboard"
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname.startsWith("/dashboard")
                  ? "text-accent1 bg-accent1/5"
                  : "text-foreground/80 hover:text-foreground hover:bg-secondary/80"
              )}
            >
              {t("navigation.dashboard") || "Dashboard"}
            </Link>
          )}
        </nav>

        {/* Right side - Auth buttons & Language switcher */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden lg:inline-block">
                  {profile?.username || profile?.full_name || user.email?.split('@')[0]}
                </span>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                {t("common.signOut")}
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  {t("common.signIn")}
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="default" size="sm">
                  {t("common.signUp")}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          {user && (
            <Link to="/dashboard">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-foreground hover:bg-secondary/80"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white/95 backdrop-blur-md animate-fade-in md:hidden pt-20">
          <div className="container px-4 py-6 flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-accent1/10 text-accent1"
                    : "hover:bg-secondary/80"
                )}
                style={{ animationDelay: `${navItems.indexOf(item) * 50}ms` }}
              >
                {item.name}
              </Link>
            ))}
            
            {user && (
              <Link
                to="/dashboard"
                className={cn(
                  "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  location.pathname.startsWith("/dashboard")
                    ? "bg-accent1/10 text-accent1"
                    : "hover:bg-secondary/80"
                )}
                style={{ animationDelay: `${navItems.length * 50}ms` }}
              >
                {t("navigation.dashboard") || "Dashboard"}
              </Link>
            )}

            <div className="pt-4 mt-6 border-t border-metal flex flex-col gap-3">
              {user ? (
                <Button
                  variant="outline"
                  className="w-full px-4 py-3 text-center"
                  onClick={() => signOut()}
                  style={{ animationDelay: `${navItems.length * 50 + 50}ms` }}
                >
                  {t("common.signOut")}
                </Button>
              ) : (
                <>
                  <Link 
                    to="/auth"
                    className="w-full px-4 py-3 text-center rounded-lg border border-metal hover:bg-secondary/80"
                    style={{ animationDelay: `${navItems.length * 50 + 50}ms` }}
                  >
                    {t("common.signIn")}
                  </Link>
                  <Link 
                    to="/auth"
                    className="w-full px-4 py-3 text-center rounded-lg bg-accent1 text-white hover:bg-accent1/90"
                    style={{ animationDelay: `${navItems.length * 50 + 100}ms` }}
                  >
                    {t("common.signUp")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
