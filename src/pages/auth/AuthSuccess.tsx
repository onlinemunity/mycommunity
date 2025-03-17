
import React from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthSuccess = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="page-transition container max-w-md mx-auto py-16 px-4">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {t('auth.successTitle') || 'Registration Successful!'}
            </CardTitle>
            <CardDescription className="text-center">
              {t('auth.successDescription') ||
                'Your account has been created successfully. Please check your email to confirm your account.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              {t('auth.checkEmailInstructions') ||
                'We sent you a confirmation email. Please check your inbox and follow the instructions to activate your account.'}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Link to="/auth" className="w-full">
              <Button className="w-full">
                {t('auth.backToSignIn') || 'Back to Sign In'}
              </Button>
            </Link>
            <Link to="/" className="text-sm text-accent1 hover:underline">
              {t('auth.backToHome') || 'Return to Home Page'}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default AuthSuccess;
