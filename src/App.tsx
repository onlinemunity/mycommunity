
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

import Index from '@/pages/Index';
import About from '@/pages/About';
import Community from '@/pages/Community';
import Courses from '@/pages/Courses';
import CourseDetail from '@/pages/CourseDetail';
import Contact from '@/pages/Contact';
import Pricing from '@/pages/Pricing';

import AuthPage from '@/pages/auth/AuthPage';
import AuthSuccess from '@/pages/auth/AuthSuccess';
import Dashboard from '@/pages/dashboard/Dashboard';
import Profile from '@/pages/dashboard/Profile';
import MemberArea from '@/pages/dashboard/MemberArea';
import MyCoursesPage from '@/pages/dashboard/MyCourses';
import AdminArea from '@/pages/dashboard/AdminArea';
import NotFound from '@/pages/NotFound';

// Admin section
import AdminDashboard from '@/pages/admin/AdminDashboard';
import CoursesManagement from '@/pages/admin/CoursesManagement';
import LecturesManagement from '@/pages/admin/LecturesManagement';
import UsersManagement from '@/pages/admin/UsersManagement';
import Settings from '@/pages/admin/Settings';

// Fix import statements to use default exports
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';
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
              
              {/* Admin Section Routes - Make sure they're correctly wrapped with AdminRoute */}
              <Route element={<AdminRoute redirectPath="/" />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/courses" element={<CoursesManagement />} />
                <Route path="/admin/lectures" element={<LecturesManagement />} />
                <Route path="/admin/users" element={<UsersManagement />} />
                <Route path="/admin/settings" element={<Settings />} />
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
