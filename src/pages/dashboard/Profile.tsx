
import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, Star, ArrowRight, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { t } = useTranslation();
  const { user, profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    fullName: profile?.full_name || '',
    avatarUrl: profile?.avatar_url || '',
  });

  // Format membership expiration date
  const formatExpirationDate = (dateString?: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          full_name: formData.fullName,
          avatar_url: formData.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: t('profile.updateSuccess') || 'Profile updated successfully',
        description: t('profile.updateSuccessDesc') || 'Your profile information has been updated.',
      });
    } catch (error: any) {
      toast({
        title: t('profile.updateError') || 'Update failed',
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeClick = () => {
    navigate('/pricing');
  };

  // Get the appropriate membership badge styling
  const getMembershipBadge = () => {
    if (profile?.user_type === 'lifetime') {
      return (
        <div className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
          Lifetime
        </div>
      );
    } else if (profile?.user_type === 'yearly') {
      return (
        <div className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
          Yearly
        </div>
      );
    } else {
      return (
        <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
          Basic
        </div>
      );
    }
  };

  // Get membership icon
  const getMembershipIcon = () => {
    if (profile?.user_type === 'lifetime') {
      return <Star className="h-4 w-4 text-purple-500 ml-1" />;
    } else if (profile?.user_type === 'yearly') {
      return <Star className="h-4 w-4 text-emerald-500 ml-1" />;
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('profile.title') || 'Your Profile'}</h1>
          <p className="text-muted-foreground">
            {t('profile.subtitle') || 'Manage your account information and preferences'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.personalInfo') || 'Personal Information'}</CardTitle>
              <CardDescription>
                {t('profile.personalInfoDesc') || 'Update your personal details and account information'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-lg">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{t('profile.avatar') || 'Profile Picture'}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('profile.avatarDesc') || 'Add your profile picture with a URL'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">{t('profile.avatarUrl') || 'Avatar URL'}</Label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatarUrl || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">{t('profile.username') || 'Username'}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      placeholder={t('profile.usernamePlaceholder') || 'johndoe'}
                      className="pl-10"
                      value={formData.username || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('profile.fullName') || 'Full Name'}</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder={t('profile.fullNamePlaceholder') || 'John Doe'}
                    value={formData.fullName || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.email') || 'Email'}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('profile.emailNote') || 'Your email cannot be changed'}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('profile.updating') || 'Updating...'}
                    </>
                  ) : (
                    t('profile.saveChanges') || 'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.accountDetails') || 'Account Details'}</CardTitle>
                <CardDescription>
                  {t('profile.accountDetailsDesc') || 'Information about your account status and membership'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-medium">{t('profile.memberSince') || 'Member Since'}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : '-'}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-medium">{t('profile.accountStatus') || 'Account Status'}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email_confirmed_at ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    user?.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.email_confirmed_at ? 'Active' : 'Pending'}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-medium">{t('profile.membershipType') || 'Membership Type'}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      {profile?.user_type === 'lifetime' ? (
                        <>
                          Lifetime Access <Star className="h-4 w-4 text-purple-500 ml-1" />
                        </>
                      ) : profile?.user_type === 'yearly' ? (
                        <>
                          Yearly Membership <Star className="h-4 w-4 text-emerald-500 ml-1" />
                        </>
                      ) : 'Basic'}
                    </p>
                    {profile?.user_type === 'yearly' && profile.membership_expires_at && (
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Expires: {formatExpirationDate(profile.membership_expires_at)}
                      </p>
                    )}
                  </div>
                  {getMembershipBadge()}
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{t('profile.accountType') || 'Account Type'}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.role === 'admin' ? 'Administrator' : 'Member'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {profile?.user_type === 'basic' && (
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 text-amber-500 mr-2" />
                    {t('profile.upgradeMembership') || 'Upgrade Your Membership'}
                  </CardTitle>
                  <CardDescription>
                    {t('profile.upgradeDesc') || 'Get access to premium courses and exclusive content'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">
                    {t('profile.upgradeMessage') || 'Upgrade to Premium to unlock all courses and features'}
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-start text-sm">
                      <div className="rounded-full bg-amber-200 p-1 mr-2 mt-0.5">
                        <svg className="h-3 w-3 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      Access to all premium courses
                    </li>
                    <li className="flex items-start text-sm">
                      <div className="rounded-full bg-amber-200 p-1 mr-2 mt-0.5">
                        <svg className="h-3 w-3 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      Yearly members get access to live events
                    </li>
                    <li className="flex items-start text-sm">
                      <div className="rounded-full bg-amber-200 p-1 mr-2 mt-0.5">
                        <svg className="h-3 w-3 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      Course completion certificates
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleUpgradeClick} 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                  >
                    {t('profile.upgradeCta') || 'Upgrade Membership'} 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
