import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/** Renders children only when user is logged in; otherwise redirects to /login */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
