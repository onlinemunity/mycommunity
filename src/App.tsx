import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { Index } from '@/pages';
import { About } from '@/pages/About';
import { Community } from '@/pages/Community';
import { Courses } from '@/pages/Courses';
import { Contact } from '@/pages/Contact';
import { Pricing } from '@/pages/Pricing';
import { CourseDetail } from '@/pages/CourseDetail';

import { AuthPage } from '@/pages/Auth';
import { AuthSuccess } from '@/pages/AuthSuccess';
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Dashboard/Profile';
import { MemberArea } from '@/pages/Dashboard/MemberArea';
import MyCoursesPage from '@/pages/dashboard/MyCourses';
import { AdminArea } from '@/pages/Dashboard/AdminArea';
import { NotFound } from '@/pages/NotFound';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

const queryClient = new QueryClient();

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/community" element={<Community />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/dashboard/member" element={<MemberArea />} />
                <Route path="/dashboard/courses" element={<MyCoursesPage />} />
                <Route path="/dashboard/courses/:courseId" element={<MyCoursesPage />} />
                <Route path="/dashboard/courses/:courseId/lecture/:lectureId" element={<MyCoursesPage />} />
              </Route>
              
              <Route element={<AdminRoute />}>
                <Route path="/dashboard/admin" element={<AdminArea />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
