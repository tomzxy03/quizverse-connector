import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import HomePage from '@/pages/HomePage';

/**
 * At "/": show HomePage when not logged in, redirect to Dashboard when logged in.
 * So the "main" page is Home for guests and Dashboard for authenticated users.
 */
export function HomeOrDashboard() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return <HomePage />;
}
