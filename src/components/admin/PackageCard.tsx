import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SubscriptionPackage } from "@/types";
import { TIER_STYLES, FILE_TYPE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  pkg: SubscriptionPackage;
  onEdit: () => void;
  onDelete: () => void;
}

export function PackageCard({ pkg, onEdit, onDelete }: PackageCardProps) {
  const style = TIER_STYLES[pkg.name];

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Badge className={cn("text-xs", style?.badge)}>{pkg.name}</Badge>
          <Badge
            variant={pkg.isActive ? "default" : "secondary"}
            className="text-xs"
          >
            {pkg.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-bold">
          ${pkg.price}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Folders:</span>{" "}
            <span className="font-medium">{pkg.maxFolders}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Nesting:</span>{" "}
            <span className="font-medium">{pkg.maxNestingLevel}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Max Size:</span>{" "}
            <span className="font-medium">{pkg.maxFileSizeMB}MB</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Files:</span>{" "}
            <span className="font-medium">{pkg.totalFileLimit}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Per Folder:</span>{" "}
            <span className="font-medium">{pkg.filesPerFolder}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {pkg.allowedFileTypes.map((t) => (
            <Badge key={t} variant="outline" className="text-xs">
              {FILE_TYPE_LABELS[t]}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
