
import { ReactNode, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

type AdminRouteProps = {
  redirectPath?: string;
}

const AdminRoute = ({ redirectPath = "/dashboard" }: AdminRouteProps) => {
  const { isAdmin, isLoading, refreshProfile, profile, user } = useAuth();
  const location = useLocation();

  // Refresh profile when component mounts or path changes to ensure we have the latest roles
  useEffect(() => {
    if (user && !isLoading) {
      console.log('AdminRoute - Refreshing profile on mount/path change');
      refreshProfile();
    }
  }, [user, isLoading, location.pathname, refreshProfile]);

  // Add enhanced debug information
  useEffect(() => {
    console.log('AdminRoute - Debug Info:', { 
      isAdmin, 
      profileRole: profile?.role,
      userId: user?.id,
      isLoading,
      currentPath: location.pathname
    });
  }, [isAdmin, profile?.role, user?.id, isLoading, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent1" />
      </div>
    );
  }

  // If user is not authenticated, redirect to auth page
  if (!user) {
    console.log('Redirecting from admin route because user is not authenticated');
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAdmin) {
    console.log('Redirecting from admin route because user is not an admin', { role: profile?.role });
    // Redirect to the dashboard instead of trying to redirect to subpaths
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
