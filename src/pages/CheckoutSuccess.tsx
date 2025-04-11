
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // If no user is authenticated, redirect to home
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Layout>
      <div className="page-transition py-16 md:py-24 container">
        <div className="max-w-md mx-auto text-center">
          <Card className="border-green-100">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <p className="text-muted-foreground mb-4">
                Your order has been successfully processed. You now have access to your purchased content.
              </p>
              <div className="text-sm border rounded-lg p-4 bg-muted/30 text-left mb-6">
                <p className="font-medium mb-1">Order details:</p>
                <p>A confirmation email has been sent to your email address.</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/courses">Browse More Courses</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccess;
