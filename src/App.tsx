import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Community from "./pages/Community";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/auth/AuthPage";
import AuthSuccess from "./pages/auth/AuthSuccess";
import Dashboard from "./pages/dashboard/Dashboard";
import MemberArea from "./pages/dashboard/MemberArea";
import AdminArea from "./pages/dashboard/AdminArea";
import Profile from "./pages/dashboard/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import CourseDetail from "./pages/CourseDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/community" element={<Community />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/courses/:courseId" element={<CourseDetail />} />
              
              {/* Auth routes */}
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/auth/success" element={<AuthSuccess />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard/member" element={<ProtectedRoute><MemberArea /></ProtectedRoute>} />
              <Route path="/dashboard/admin" element={<AdminRoute><AdminArea /></AdminRoute>} />
              
              {/* 404 and fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
