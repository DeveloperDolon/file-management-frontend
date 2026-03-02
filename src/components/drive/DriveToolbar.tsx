import { FolderPlus, Upload, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DriveToolbarProps {
  onNewFolder: () => void;
  onUpload?: () => void;
  showUpload?: boolean;
  viewMode: "grid" | "list";
  onToggleView: () => void;
}

export function DriveToolbar({
  onNewFolder,
  onUpload,
  showUpload,
  viewMode,
  onToggleView,
}: DriveToolbarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button size="sm" onClick={onNewFolder}>
        <FolderPlus className="h-4 w-4 mr-2" /> New Folder
      </Button>
      {showUpload && onUpload && (
        <Button size="sm" variant="outline" onClick={onUpload}>
          <Upload className="h-4 w-4 mr-2" /> Upload File
        </Button>
      )}
      <div className="ml-auto">
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleView}
          aria-label="Toggle view"
        >
          {viewMode === "grid" ? (
            <List className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
