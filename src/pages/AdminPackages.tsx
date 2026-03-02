/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useGetPackagesQuery,
  useAdminCreatePackageMutation,
  useAdminUpdatePackageMutation,
  useAdminDeletePackageMutation,
} from "@/store/api/packageApi";
import { PackageCard } from "@/components/admin/PackageCard";
import { PackageFormModal } from "@/components/admin/PackageFormModal";
import { DeleteConfirmDialog } from "@/components/drive/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { SubscriptionPackage } from "@/types";

export default function AdminPackagesPage() {
  const { data: res, isLoading } = useGetPackagesQuery();
  const [createPkg, { isLoading: creating }] = useAdminCreatePackageMutation();
  const [updatePkg, { isLoading: updating }] = useAdminUpdatePackageMutation();
  const [deletePkg, { isLoading: deleting }] = useAdminDeletePackageMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editPkg, setEditPkg] = useState<SubscriptionPackage | null>(null);
  const [deletePkgId, setDeletePkgId] = useState<string | null>(null);

  const packages = res?.data || [];

  const handleSubmit = async (data: any) => {
    try {
      if (editPkg) {
        const r = await updatePkg({ id: editPkg.id, data }).unwrap();
        toast.success(r.message || "Package updated");
      } else {
        const r = await createPkg(data).unwrap();
        toast.success(r.message || "Package created");
      }
      setFormOpen(false);
      setEditPkg(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!deletePkgId) return;
    try {
      const r = await deletePkg(deletePkgId).unwrap();
      toast.success(r.message || "Package deleted");
      setDeletePkgId(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Packages</h1>
          <p className="text-muted-foreground">Manage subscription plans</p>
        </div>
        <Button
          onClick={() => {
            setEditPkg(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Create Package
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <EmptyState
          title="No packages"
          description="Create your first subscription package"
          actionLabel="Create Package"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onEdit={() => {
                setEditPkg(pkg);
                setFormOpen(true);
              }}
              onDelete={() => setDeletePkgId(pkg.id)}
            />
          ))}
        </div>
      )}

      <PackageFormModal
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v);
          if (!v) setEditPkg(null);
        }}
        pkg={editPkg}
        onSubmit={handleSubmit}
        isLoading={creating || updating}
      />

      <DeleteConfirmDialog
        open={!!deletePkgId}
        onOpenChange={() => setDeletePkgId(null)}
        title="Delete Package"
        description="Are you sure you want to delete this package? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
