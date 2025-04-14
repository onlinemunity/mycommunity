
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "./context/CartContext";

// Page imports
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseDiscussions from "./pages/CourseDiscussions";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Academy from "./pages/Academy";
import Pricing from "./pages/Pricing";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from './pages/CheckoutSuccess';

// Auth pages
import AuthPage from "./pages/auth/AuthPage";
import AuthSuccess from "./pages/auth/AuthSuccess";

// Dashboard pages
import Dashboard from "./pages/dashboard/Dashboard";
import MyCourses from "./pages/dashboard/MyCourses";
import Profile from "./pages/dashboard/Profile";
import MemberArea from "./pages/dashboard/MemberArea";
import AdminArea from "./pages/dashboard/AdminArea";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import CoursesManagement from "./pages/admin/CoursesManagement";
import LecturesManagement from "./pages/admin/LecturesManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import Settings from "./pages/admin/Settings";

// Auth components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/courses/:id/discussions" element={<CourseDiscussions />} />
                <Route path="/community" element={<Community />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/academy" element={<Academy />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout/success" element={<CheckoutSuccess />} />
                
                {/* Auth routes */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/success" element={<AuthSuccess />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/courses" element={<MyCourses />} />
                  <Route path="/dashboard/courses/:courseId" element={<MyCourses />} />
                  <Route path="/dashboard/courses/:courseId/lecture/:lectureId" element={<MyCourses />} />
                  <Route path="/dashboard/profile" element={<Profile />} />
                  <Route path="/dashboard/member" element={<MemberArea />} />
                  <Route path="/dashboard/admin" element={<AdminArea />} />
                </Route>

                {/* Admin routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UsersManagement />} />
                  <Route path="/admin/courses" element={<CoursesManagement />} />
                  <Route path="/admin/lectures" element={<LecturesManagement />} />
                  <Route path="/admin/orders" element={<OrdersManagement />} />
                  <Route path="/admin/settings" element={<Settings />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
