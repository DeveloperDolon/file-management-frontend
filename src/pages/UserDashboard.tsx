import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useGetMySubscriptionQuery } from "@/store/api/subscriptionApi";
import { useGetRootFoldersQuery } from "@/store/api/folderApi";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { TIER_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { HardDrive, CreditCard, FolderOpen, FileIcon } from "lucide-react";

export default function UserDashboardPage() {
  const { data: subRes, isLoading: subLoading } = useGetMySubscriptionQuery();
  const { data: foldersRes, isLoading: foldersLoading } =
    useGetRootFoldersQuery();

  const activeSub = subRes?.data?.active;
  const pkg = activeSub?.package;
  const tierStyle = pkg ? TIER_STYLES[pkg.name] : null;
  const folderCount = foldersRes?.data?.length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to CloudVault</p>
      </div>

      {subLoading || foldersLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Plan
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {pkg ? (
                  <Badge className={cn("text-sm", tierStyle?.badge)}>
                    {pkg.name}
                  </Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No active plan
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Folders
                </CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {folderCount}
                  {pkg ? (
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      / {pkg.maxFolders}
                    </span>
                  ) : null}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total File Limit
                </CardTitle>
                <FileIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {pkg ? pkg.totalFileLimit : "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Link to="/drive">
              <Button>
                <HardDrive className="h-4 w-4 mr-2" /> Go to Drive
              </Button>
            </Link>
            <Link to="/subscription">
              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" /> Manage Subscription
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
