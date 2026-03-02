/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetPackagesQuery } from "@/store/api/packageApi";
import {
  useGetMySubscriptionQuery,
  useSelectPackageMutation,
} from "@/store/api/subscriptionApi";
import { PackagePricingCard } from "@/components/subscription/PackagePricingCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useState } from "react";
import { SubscriptionHistoryTable } from "@/components/subscription/SubscriptionHistoryTable";

export default function SubscriptionPage() {
  const { data: pkgRes, isLoading: pkgLoading } = useGetPackagesQuery();
  const { data: subRes, isLoading: subLoading } = useGetMySubscriptionQuery();
  const [selectPkg] = useSelectPackageMutation();
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const packages = pkgRes?.data || [];
  const activeSub = subRes?.data?.active;
  const history = subRes?.data?.history || [];

  const handleSelect = async (packageId: string) => {
    setSelectingId(packageId);
    try {
      const res = await selectPkg(packageId).unwrap();
      toast.success(res.message || "Plan selected successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to select plan");
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">
          Choose a plan that fits your needs
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        {pkgLoading || subLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <PackagePricingCard
                key={pkg.id}
                pkg={pkg}
                isActive={activeSub?.packageId === pkg.id}
                onSelect={() => handleSelect(pkg.id)}
                isLoading={selectingId === pkg.id}
              />
            ))}
          </div>
        )}
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-4">Subscription History</h2>
        <SubscriptionHistoryTable history={history} />
      </section>
    </div>
  );
}
