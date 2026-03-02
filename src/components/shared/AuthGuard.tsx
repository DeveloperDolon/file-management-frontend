import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN_KEY, ADMIN_TOKEN_KEY } from "@/lib/constants";

export function UserGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  if (!token) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
