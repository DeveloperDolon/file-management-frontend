/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetFolderChildrenQuery,
  useRenameFolderMutation,
  useDeleteFolderMutation,
} from "@/store/api/folderApi";
import {
  useRenameFileMutation,
  useDeleteFileMutation,
} from "@/store/api/fileApi";
import { FolderCard } from "@/components/drive/FolderCard";
import { FileCard } from "@/components/drive/FileCard";
import { CreateFolderModal } from "@/components/drive/CreateFolderModal";
import { RenameModal } from "@/components/drive/RenameModal";
import { DeleteConfirmDialog } from "@/components/drive/DeleteConfirmDialog";
import { FileUploadZone } from "@/components/drive/FileUploadZone";
import { DriveToolbar } from "@/components/drive/DriveToolbar";
import { DriveBreadcrumb } from "@/components/drive/Breadcrumb";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { useDrive } from "@/hooks/useDrive";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import type { FileItem } from "@/types";
import { FolderOpen, FileIcon } from "lucide-react";
import { API_BASE_URL, ACCESS_TOKEN_KEY } from "@/lib/constants";

export default function FolderViewPage() {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const { breadcrumbs, viewMode, toggleView, navigateToFolder } = useDrive();
  const { data: res, isLoading } = useGetFolderChildrenQuery(folderId!, {
    skip: !folderId,
  });

  const [renameFolder, { isLoading: renamingFolder }] =
    useRenameFolderMutation();
  const [deleteFolder, { isLoading: deletingFolder }] =
    useDeleteFolderMutation();
  const [renameFile, { isLoading: renamingFile }] = useRenameFileMutation();
  const [deleteFile, { isLoading: deletingFile }] = useDeleteFileMutation();

  const [createOpen, setCreateOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{
    type: "folder" | "file";
    id: string;
    name: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "folder" | "file";
    id: string;
    name: string;
  } | null>(null);

  const folderData = res?.data;
  const subFolders = folderData?.subFolders || [];
  const files = folderData?.files || [];

  // Update breadcrumbs when folder data loads
  useEffect(() => {
    if (folderData?.folder && folderId) {
      navigateToFolder({ id: folderId, name: folderData.folder.name });
    }
  }, [folderData?.folder?.name, folderId]);

  const handleRename = async (name: string) => {
    if (!renameTarget) return;
    try {
      if (renameTarget.type === "folder") {
        const r = await renameFolder({ id: renameTarget.id, name }).unwrap();
        toast.success(r.message || "Renamed");
      } else {
        const r = await renameFile({ id: renameTarget.id, name }).unwrap();
        toast.success(r.message || "Renamed");
      }
      setRenameTarget(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Rename failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "folder") {
        const r = await deleteFolder(deleteTarget.id).unwrap();
        toast.success(r.message || "Deleted");
      } else {
        const r = await deleteFile(deleteTarget.id).unwrap();
        toast.success(r.message || "Deleted");
      }
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  const handleDownload = async (file: FileItem) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);

      const response = await fetch(
        `${API_BASE_URL}/files/${file.id}/download`,
        {
          headers: { Authorization: `${token}` },
        },
      );

      if (!response.ok) throw new Error("Download failed!");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName || file.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <DriveBreadcrumb items={breadcrumbs} />

      <DriveToolbar
        onNewFolder={() => setCreateOpen(true)}
        showUpload
        onUpload={() => setShowUpload(!showUpload)}
        viewMode={viewMode}
        onToggleView={toggleView}
      />

      {showUpload && folderId && <FileUploadZone folderId={folderId} />}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Subfolders */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Folders
            </h2>
            {subFolders.length === 0 ? (
              <EmptyState
                icon={<FolderOpen className="w-6 h-6 text-muted-foreground" />}
                title="No subfolders"
                description="Create a subfolder to organize files"
              />
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-2"
                }
              >
                {subFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onClick={() => navigate(`/drive/${folder.id}`)}
                    onRename={() =>
                      setRenameTarget({
                        type: "folder",
                        id: folder.id,
                        name: folder.name,
                      })
                    }
                    onDelete={() =>
                      setDeleteTarget({
                        type: "folder",
                        id: folder.id,
                        name: folder.name,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </section>

          <Separator />

          {/* Files */}
          <section>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Files
            </h2>
            {files.length === 0 ? (
              <EmptyState
                icon={<FileIcon className="w-6 h-6 text-muted-foreground" />}
                title="No files"
                description="Upload files to this folder"
                actionLabel="Upload File"
                onAction={() => setShowUpload(true)}
              />
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-2"
                }
              >
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onRename={() =>
                      setRenameTarget({
                        type: "file",
                        id: file.id,
                        name: file.name,
                      })
                    }
                    onDelete={() =>
                      setDeleteTarget({
                        type: "file",
                        id: file.id,
                        name: file.name,
                      })
                    }
                    onDownload={() => handleDownload(file)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <CreateFolderModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        parentId={folderId}
      />

      {renameTarget && (
        <RenameModal
          open={!!renameTarget}
          onOpenChange={() => setRenameTarget(null)}
          currentName={renameTarget.name}
          onRename={handleRename}
          isLoading={renamingFolder || renamingFile}
        />
      )}

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.type === "folder" ? "Folder" : "File"}`}
        description={`Permanently delete "${deleteTarget?.name}"?${deleteTarget?.type === "folder" ? " All contents inside will also be deleted." : ""}`}
        onConfirm={handleDelete}
        isLoading={deletingFolder || deletingFile}
      />
    </div>
  );
}
