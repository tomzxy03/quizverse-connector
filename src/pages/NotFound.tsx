
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "@/components/layout/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <p className="text-2xl font-semibold mb-4 text-foreground">Page not found</p>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center justify-center">
            Return to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
