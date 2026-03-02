import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { SubscriptionPackage } from "@/types";
import { TIER_STYLES, FILE_TYPE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PackagePricingCardProps {
  pkg: SubscriptionPackage;
  isActive: boolean;
  onSelect: () => void;
  isLoading?: boolean;
}

export function PackagePricingCard({
  pkg,
  isActive,
  onSelect,
  isLoading,
}: PackagePricingCardProps) {
  const style = TIER_STYLES[pkg.name];

  return (
    <Card
      className={cn(
        "relative transition-all hover:shadow-lg",
        isActive && "ring-2 ring-primary",
      )}
    >
      {isActive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Current Plan
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-2">
        <Badge className={cn("w-fit mx-auto mb-2", style?.badge)}>
          {pkg.name}
        </Badge>
        <CardTitle className="text-3xl font-bold">
          ${pkg.price}
          <span className="text-sm font-normal text-muted-foreground">/mo</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Feature label="Folders" value={`${pkg.maxFolders}`} />
        <Feature label="Nesting Level" value={`${pkg.maxNestingLevel}`} />
        <Feature label="Max File Size" value={`${pkg.maxFileSizeMB} MB`} />
        <Feature label="Total Files" value={`${pkg.totalFileLimit}`} />
        <Feature label="Files per Folder" value={`${pkg.filesPerFolder}`} />
        <div>
          <p className="text-xs text-muted-foreground mb-1">File Types</p>
          <div className="flex flex-wrap gap-1">
            {pkg.allowedFileTypes.map((t) => (
              <Badge key={t} variant="outline" className="text-xs">
                {FILE_TYPE_LABELS[t] || t}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={isActive || isLoading}
          onClick={onSelect}
        >
          {isActive ? "Active" : isLoading ? "Selecting..." : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function Feature({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Check className="h-4 w-4 text-success shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium ml-auto">{value}</span>
    </div>
  );
}
