
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
  },
  {
    name: 'Courses',
    path: '/admin/courses',
    icon: <BookOpen size={18} />,
  },
  {
    name: 'Lectures',
    path: '/admin/lectures',
    icon: <VideoIcon size={18} />,
  },
  {
    name: 'Users',
    path: '/admin/users',
    icon: <Users size={18} />,
  },
  {
    name: 'Orders',
    path: '/admin/orders',
    icon: <ShoppingCart size={18} />,
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: <Settings size={18} />,
  },
];

export const AdminNavigation = () => {
  const location = useLocation();
  
  console.log('AdminNavigation - Current path:', location.pathname);

  return (
    <nav className="flex overflow-x-auto pb-2 mb-6 border-b">
      <div className="flex space-x-1">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              location.pathname === item.path
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
