
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { FileQuestion, Search, Home, BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container py-24 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="bg-secondary w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-2xl font-medium">Page Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="gap-2">
              <Link to="/courses">
                <BookOpen className="h-4 w-4" />
                Browse Courses
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Looking for something specific?</p>
            <div className="flex items-center justify-center">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-sm">Try navigating using the menu above</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
