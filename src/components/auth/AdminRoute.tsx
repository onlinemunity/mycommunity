
import { ReactNode, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

type AdminRouteProps = {
  redirectPath?: string;
}

const AdminRoute = ({ redirectPath = "/dashboard" }: AdminRouteProps) => {
  const { isAdmin, isLoading, refreshProfile, profile, user } = useAuth();

  // Refresh profile when component mounts to ensure we have the latest roles
  useEffect(() => {
    if (user && !isLoading) {
      refreshProfile();
    }
  }, [user, isLoading, refreshProfile]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent1" />
      </div>
    );
  }

  // Add enhanced debug information
  console.log('AdminRoute - Debug Info:', { 
    isAdmin, 
    profileRole: profile?.role,
    userId: user?.id,
    isLoading
  });

  if (!isAdmin) {
    console.log('Redirecting from admin route because user is not an admin');
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
