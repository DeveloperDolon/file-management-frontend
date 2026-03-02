import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPackagesQuery } from "@/store/api/packageApi";
import { Package } from "lucide-react";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { data: pkgRes, isLoading } = useGetPackagesQuery();
  const packages = pkgRes?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your CloudVault platform</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Packages
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{packages.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Packages
                </CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {packages.filter((p) => p.isActive).length}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div>
        <Link to="/admin/packages">
          <Button>Manage Packages</Button>
        </Link>
      </div>
    </div>
  );
}
