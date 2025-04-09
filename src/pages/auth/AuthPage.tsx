
import React from 'react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

const AuthPage = () => {
  const { t } = useTranslation();
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  // If user is already logged in, redirect to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignIn) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
        });
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-transition container max-w-md mx-auto py-16 px-4">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isSignIn ? t('auth.signIn') || 'Sign In' : t('auth.signUp') || 'Create an Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignIn
                ? t('auth.signInDescription') || 'Enter your credentials to sign in to your account'
                : t('auth.signUpDescription') || 'Enter your details to create a new account'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!isSignIn && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('auth.fullName') || 'Full Name'}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder={t('auth.fullNamePlaceholder') || 'John Doe'}
                      className="pl-10"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required={!isSignIn}
                    />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email') || 'Email'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder') || 'name@example.com'}
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('auth.password') || 'Password'}</Label>
                  {isSignIn && (
                    <a href="#" className="text-xs text-accent1 hover:underline">
                      {t('auth.forgotPassword') || 'Forgot password?'}
                    </a>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t('auth.passwordPlaceholder') || '••••••••'}
                    className="pl-10"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isSignIn ? (
                  t('auth.signInButton') || 'Sign In'
                ) : (
                  t('auth.signUpButton') || 'Create Account'
                )}
              </Button>
              <div className="text-center text-sm">
                {isSignIn ? (
                  <span>
                    {t('auth.noAccount') || "Don't have an account?"}{' '}
                    <button
                      type="button"
                      className="text-accent1 hover:underline"
                      onClick={() => setIsSignIn(false)}
                    >
                      {t('auth.createAccount') || 'Create one'}
                    </button>
                  </span>
                ) : (
                  <span>
                    {t('auth.haveAccount') || 'Already have an account?'}{' '}
                    <button
                      type="button"
                      className="text-accent1 hover:underline"
                      onClick={() => setIsSignIn(true)}
                    >
                      {t('auth.signInNow') || 'Sign in'}
                    </button>
                  </span>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AuthPage;
