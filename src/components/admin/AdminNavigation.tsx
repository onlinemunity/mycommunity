
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  ShoppingCart,
  Settings,
  Home
} from 'lucide-react';

export function AdminNavigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/admin' && currentPath === '/admin') {
      return true;
    }
    if (path !== '/admin' && currentPath.startsWith(path)) {
      return true;
    }
    return false;
  };

  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Courses',
      href: '/admin/courses',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: 'Lectures',
      href: '/admin/lectures',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="group flex flex-col gap-4">
      <div className="flex items-center gap-2 px-2 mb-2">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <p className="text-sm font-medium leading-none">Admin Panel</p>
          <p className="text-xs text-muted-foreground">Manage your application</p>
        </div>
      </div>
      <nav className="grid gap-1 px-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
              isActive(item.href) ? "bg-accent text-accent-foreground" : "transparent"
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
