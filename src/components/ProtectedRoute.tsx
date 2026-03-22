import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

/** Renders children only when user is logged in; otherwise redirects to /login */
export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading, user } = useAuth();
  const location = useLocation();

  // While validating the token on mount, show a simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRoles?.length) {
    const hasRole = user?.roles?.some((r) => requiredRoles.includes(r));
    if (!hasRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
