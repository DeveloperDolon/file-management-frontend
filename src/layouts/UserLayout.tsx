import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/shared/Sidebar";
import { Header } from "@/components/shared/Header";
import { useAuth } from "@/hooks/useAuth";
import { useGetMySubscriptionQuery } from "@/store/api/subscriptionApi";

export function UserLayout() {
  const { logoutUser } = useAuth();
  const { data: subRes } = useGetMySubscriptionQuery();
  const activeTier = subRes?.data?.active?.package?.name;

  const sidebar = (
    <AppSidebar
      variant="user"
      userName="User"
      activeTier={activeTier}
      onLogout={logoutUser}
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
