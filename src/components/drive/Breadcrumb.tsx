import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import type { BreadcrumbItem } from "@/types";

interface DriveBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function DriveBreadcrumb({ items }: DriveBreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-1 text-sm text-muted-foreground overflow-x-auto"
      aria-label="Breadcrumb"
    >
      <Link
        to="/drive"
        className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
      >
        <Home className="h-4 w-4" /> My Drive
      </Link>
      {items.map((item) => (
        <span key={item.id} className="flex items-center gap-1 shrink-0">
          <ChevronRight className="h-3 w-3" />
          <Link
            to={`/drive/${item.id}`}
            className="hover:text-foreground transition-colors truncate max-w-[120px]"
          >
            {item.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}
