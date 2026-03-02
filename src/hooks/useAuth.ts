import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_KEY, ADMIN_TOKEN_KEY } from "@/lib/constants";

export function useAuth() {
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_KEY);
  const isAdminAuthenticated = !!localStorage.getItem(ADMIN_TOKEN_KEY);

  const loginUser = useCallback((token: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }, []);

  const loginAdmin = useCallback((token: string) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    navigate("/login");
  }, [navigate]);

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate("/admin/login");
  }, [navigate]);

  return {
    isAuthenticated,
    isAdminAuthenticated,
    loginUser,
    loginAdmin,
    logoutUser,
    logoutAdmin,
  };
}
