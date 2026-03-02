import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster as Sonner } from "sonner";
import { Toaster } from "./components/ui/toaster";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import AdminLoginPage from "./pages/AdminLogin";
import { AdminGuard, UserGuard } from "./components/shared/AuthGuard";
import { UserLayout } from "./layouts/UserLayout";
import UserDashboardPage from "./pages/UserDashboard";
import DrivePage from "./pages/Drive";
import FolderViewPage from "./pages/FolderView";
import SubscriptionPage from "./pages/Subscription";
import { AdminLayout } from "./layouts/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboard";
import AdminPackagesPage from "./pages/AdminPackages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route
              element={
                <UserGuard>
                  <UserLayout />
                </UserGuard>
              }
            >
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/drive" element={<DrivePage />} />
              <Route path="/drive/:folderId" element={<FolderViewPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
            </Route>

            {/* Admin routes */}
            <Route
              element={
                <AdminGuard>
                  <AdminLayout />
                </AdminGuard>
              }
            >
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/packages" element={<AdminPackagesPage />} />
            </Route>

            {/* Default */}
            <Route path="/" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
