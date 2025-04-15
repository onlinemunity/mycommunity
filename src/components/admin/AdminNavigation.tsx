
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  VideoIcon, 
  Users, 
  Settings,
  ShoppingCart
} from 'lucide-react';

const navItems = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: <LayoutDashboard size={18} />,
    exact: true
  },
  {
    name: 'Courses',
    path: '/admin/courses',
    icon: <BookOpen size={18} />,
    exact: false
  },
  {
    name: 'Lectures',
    path: '/admin/lectures',
    icon: <VideoIcon size={18} />,
    exact: false
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: <Users size={18} />,
    exact: false
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    icon: <ShoppingCart size={18} />,
    exact: false
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: <Settings size={18} />,
    exact: false
  },
];

export const AdminNavigation = () => {
  const location = useLocation();
  
  // Updated isActive check to handle exact matches and sub-paths
  const isActive = (path: string, exact: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="flex overflow-x-auto pb-2 mb-6 border-b">
      <div className="flex space-x-1">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isActive(item.path, item.exact)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};
