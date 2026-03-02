/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetRootFoldersQuery,
  useRenameFolderMutation,
  useDeleteFolderMutation,
} from "@/store/api/folderApi";
import { FolderCard } from "@/components/drive/FolderCard";
import { CreateFolderModal } from "@/components/drive/CreateFolderModal";
import { RenameModal } from "@/components/drive/RenameModal";
import { DeleteConfirmDialog } from "@/components/drive/DeleteConfirmDialog";
import { DriveToolbar } from "@/components/drive/DriveToolbar";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { useDrive } from "@/hooks/useDrive";
import { toast } from "sonner";
import type { Folder } from "@/types";
import { FolderOpen } from "lucide-react";

export default function DrivePage() {
  const navigate = useNavigate();
  const { viewMode, toggleView, reset } = useDrive();
  const { data: res, isLoading } = useGetRootFoldersQuery();
  const [renameFolder, { isLoading: renaming }] = useRenameFolderMutation();
  const [deleteFolder, { isLoading: deleting }] = useDeleteFolderMutation();

  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Folder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Folder | null>(null);

  const folders = res?.data || [];

  // Reset breadcrumbs when at root
  useState(() => {
    reset();
  });

  const handleRename = async (name: string) => {
    if (!renameTarget) return;
    try {
      const r = await renameFolder({ id: renameTarget.id, name }).unwrap();
      toast.success(r.message || "Folder renamed");
      setRenameTarget(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Rename failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const r = await deleteFolder(deleteTarget.id).unwrap();
      toast.success(r.message || "Folder deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">My Drive</h1>
        <p className="text-sm text-muted-foreground">
          Files must be uploaded inside a folder
        </p>
      </div>

      <DriveToolbar
        onNewFolder={() => setCreateOpen(true)}
        viewMode={viewMode}
        onToggleView={toggleView}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : folders.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="w-8 h-8 text-muted-foreground" />}
          title="No folders yet"
          description="Create your first folder to start organizing your files"
          actionLabel="Create Folder"
          onAction={() => setCreateOpen(true)}
        />
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "space-y-2"
          }
        >
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => navigate(`/drive/${folder.id}`)}
              onRename={() => setRenameTarget(folder)}
              onDelete={() => setDeleteTarget(folder)}
            />
          ))}
        </div>
      )}

      <CreateFolderModal open={createOpen} onOpenChange={setCreateOpen} />

      {renameTarget && (
        <RenameModal
          open={!!renameTarget}
          onOpenChange={() => setRenameTarget(null)}
          currentName={renameTarget.name}
          onRename={handleRename}
          isLoading={renaming}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Folder"
        description={`Delete "${deleteTarget?.name}"? All subfolders and files inside will be permanently deleted.`}
        onConfirm={handleDelete}
        isLoading={deleting}
      />
    </div>
  );
}
