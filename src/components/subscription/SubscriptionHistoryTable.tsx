import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { UserSubscription } from "@/types";
import { format } from "date-fns";
import { TIER_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SubscriptionHistoryTable({
  history,
}: {
  history: UserSubscription[];
}) {
  if (history.length === 0)
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No subscription history yet.
      </p>
    );

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Package</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((sub) => {
            const style = TIER_STYLES[sub.package.name];
            return (
              <TableRow key={sub.id}>
                <TableCell>
                  <Badge className={cn("text-xs", style?.badge)}>
                    {sub.package.name}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(sub.startDate), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-sm">
                  {sub.endDate
                    ? format(new Date(sub.endDate), "MMM d, yyyy")
                    : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={sub.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {sub.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
