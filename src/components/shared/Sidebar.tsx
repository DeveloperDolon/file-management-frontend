import { Link, useLocation } from "react-router-dom";
import {
  HardDrive,
  LayoutDashboard,
  CreditCard,
  LogOut,
  ShieldCheck,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TIER_STYLES } from "@/lib/constants";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const userLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "My Drive",
    href: "/drive",
    icon: <HardDrive className="h-4 w-4" />,
  },
  {
    label: "Subscription",
    href: "/subscription",
    icon: <CreditCard className="h-4 w-4" />,
  },
];

const adminLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    label: "Packages",
    href: "/admin/packages",
    icon: <Package className="h-4 w-4" />,
  },
];

interface AppSidebarProps {
  variant: "user" | "admin";
  userName?: string;
  userEmail?: string;
  activeTier?: string;
  onLogout: () => void;
}

export function AppSidebar({
  variant,
  userName,
  userEmail,
  activeTier,
  onLogout,
}: AppSidebarProps) {
  const location = useLocation();
  const links = variant === "admin" ? adminLinks : userLinks;
  const tierStyle = activeTier ? TIER_STYLES[activeTier] : null;

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center gap-2 px-4 border-b border-sidebar-border">
        <HardDrive className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">CloudVault</span>
        {variant === "admin" && (
          <Badge
            variant="outline"
            className="ml-auto text-xs border-primary text-primary"
          >
            <ShieldCheck className="h-3 w-3 mr-1" /> Admin
          </Badge>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const active =
            location.pathname === link.href ||
            location.pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="p-4 space-y-3">
        {activeTier && tierStyle && (
          <Badge className={cn("text-xs", tierStyle.badge)}>
            {activeTier} Plan
          </Badge>
        )}
        {userName && (
          <div>
            <p className="text-sm font-medium truncate">{userName}</p>
            {userEmail && (
              <p className="text-xs text-muted-foreground truncate">
                {userEmail}
              </p>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
}
