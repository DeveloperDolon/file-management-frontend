import { Header } from "@/components/shared/Header";
import { AppSidebar } from "@/components/shared/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGetAdminProfileQuery } from "@/store/api/adminApi";

export function AdminLayout() {
  const { logoutAdmin } = useAuth();
  const { data: profileRes } = useGetAdminProfileQuery();
  const admin = profileRes?.data;

  const sidebar = (
    <AppSidebar
      variant="admin"
      userName={admin?.name}
      userEmail={admin?.email}
      onLogout={logoutAdmin}
    />
  );

  return (
    <div className="min-h-screen flex w-full">
      <div className="hidden lg:block w-64 shrink-0 border-r">{sidebar}</div>
      <div className="flex-1 flex flex-col min-w-0">
        <Header sidebar={sidebar} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
