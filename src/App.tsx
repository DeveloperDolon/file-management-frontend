import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster as Sonner } from "sonner";
import { Toaster } from "./components/ui/toaster";
import { PageLoader } from "./components/shared/PageLoader";
import { AdminGuard, UserGuard } from "./components/shared/AuthGuard";
import { UserLayout } from "./layouts/UserLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// ── Auth pages ───────────────────────────────────────────
const LoginPage = lazy(() => import("./pages/Login"));
const RegisterPage = lazy(() => import("./pages/Register"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPassword"));
const AdminLoginPage = lazy(() => import("./pages/AdminLogin"));

// ── User pages ───────────────────────────────────────────
const UserDashboardPage = lazy(() => import("./pages/UserDashboard"));
const DrivePage = lazy(() => import("./pages/Drive"));
const FolderViewPage = lazy(() => import("./pages/FolderView"));
const SubscriptionPage = lazy(() => import("./pages/Subscription"));

// ── Admin pages ──────────────────────────────────────────
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboard"));
const AdminPackagesPage = lazy(() => import("./pages/AdminPackages"));

// ── Misc ─────────────────────────────────────────────────
const NotFound = lazy(() => import("./pages/NotFound"));

// -- Home page -----------------------------
const HomePage = lazy(() => import("./pages/Home"));

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner richColors closeButton />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Auth ── */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordPage />}
              />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* ── User (protected) ── */}
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

              {/* ── Admin (protected) ── */}
              <Route
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route
                  path="/admin/dashboard"
                  element={<AdminDashboardPage />}
                />
                <Route path="/admin/packages" element={<AdminPackagesPage />} />
              </Route>

              {/* ── Default ── */}
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
