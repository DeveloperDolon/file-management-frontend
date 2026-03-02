import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  sidebar?: React.ReactNode;
  title?: string;
}

export function Header({ sidebar, title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card px-4 lg:px-6">
      {sidebar && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            {sidebar}
          </SheetContent>
        </Sheet>
      )}
      {title && (
        <h1 className="text-lg font-semibold hidden sm:block">{title}</h1>
      )}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
