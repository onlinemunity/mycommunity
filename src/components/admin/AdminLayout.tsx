
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard,
  BookOpen,
  VideoIcon,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Home,
  GraduationCap,
  Server,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Courses',
      path: '/admin/courses',
      icon: <BookOpen size={20} />,
    },
    {
      name: 'Lectures',
      path: '/admin/lectures',
      icon: <VideoIcon size={20} />,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: <Users size={20} />,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingCart size={20} />,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: <Settings size={20} />,
    },
  ];

  const quickLinks = [
    { name: 'Main Site', path: '/', icon: <Home size={16} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
    { name: 'Courses', path: '/courses', icon: <GraduationCap size={16} /> },
    { name: 'Admin Area', path: '/dashboard/admin', icon: <Server size={16} /> },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-secondary/10 border-r border-border">
        <div className="p-4 h-20 border-b border-border flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:bg-gray-100 hover:text-foreground'
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex flex-col gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Quick Links</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-1 p-2 w-[200px]">
                      {quickLinks.map((link) => (
                        <li key={link.path}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={link.path}
                              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                            >
                              {link.icon}
                              <span>{link.name}</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard">
                <LayoutDashboard size={18} className="mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut size={18} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-background border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg">Admin Panel</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-foreground hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-20 bg-background/80 backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'md:hidden fixed top-16 bottom-0 left-0 z-20 w-64 bg-secondary/10 border-r border-border transform transition-transform duration-200 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-foreground/70 hover:bg-gray-100 hover:text-foreground'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex flex-col gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Quick Links</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-1 p-2 w-[200px]">
                      {quickLinks.map((link) => (
                        <li key={link.path}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={link.path}
                              className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {link.icon}
                              <span>{link.name}</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <LayoutDashboard size={18} className="mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut size={18} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pt-0 pt-16">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};
