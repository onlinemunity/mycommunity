import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import {
  LayoutDashboard,
  User,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { t } = useTranslation();
  const { user, profile, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const navItems = [
    {
      name: t('dashboard.overview') || 'Overview',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: t('dashboard.profile.myprofile') || 'Profile',
      path: '/dashboard/profile',
      icon: <User size={20} />,
    },
    {
      name: t('dashboard.courses.myCourses') || 'My Courses',
      path: '/dashboard/courses',
      icon: <BookOpen size={20} />,
    },
    {
      name: t('dashboard.memberArea') || 'Member Area',
      path: '/dashboard/member',
      icon: <Users size={20} />,
    },
  ];

  const adminItems = [
    {
      name: t('dashboard.adminArea') || 'Admin Area',
      path: '/dashboard/admin',
      icon: <Shield size={20} />,
    },
  ];

  const displayItems = isAdmin ? [...navItems, ...adminItems] : navItems;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar-background border-r border-border">
        <div className="p-4 h-20 border-b border-border flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent1 to-accent1-light flex items-center justify-center shadow-sm">
              <span className="font-display text-white text-lg font-bold">C</span>
            </div>
            <span className="font-display font-bold text-xl">Community</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {displayItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                location.pathname === item.path
                  ? 'bg-accent1/10 text-accent1'
                  : 'text-foreground/70 hover:bg-gray-100 hover:text-foreground'
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{profile?.full_name || user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">
                {isAdmin ? 'Admin' : 'Member'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut size={18} className="mr-2" />
              {t('common.signOut') || 'Sign Out'}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-16 bg-background border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent1 to-accent1-light flex items-center justify-center shadow-sm">
            <span className="font-display text-white text-sm font-bold">C</span>
          </div>
          <span className="font-display font-bold text-lg">Community</span>
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
        <div className="md:hidden fixed inset-0 z-20 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'md:hidden fixed top-16 bottom-0 left-0 z-20 w-64 bg-sidebar-background border-r border-border transform transition-transform duration-200 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="flex-1 p-4 space-y-1">
          {displayItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                location.pathname === item.path
                  ? 'bg-accent1/10 text-accent1'
                  : 'text-foreground/70 hover:bg-gray-100 hover:text-foreground'
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{profile?.full_name || user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">
                {isAdmin ? 'Admin' : 'Member'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut size={18} className="mr-2" />
              {t('common.signOut') || 'Sign Out'}
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
