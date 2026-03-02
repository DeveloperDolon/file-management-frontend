import {
  Image,
  Video,
  FileText,
  Music,
  File,
  MoreHorizontal,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { FileItem, FileType } from "@/types";
import { format } from "date-fns";

const fileIcons: Record<FileType, React.ReactNode> = {
  IMAGE: <Image className="h-5 w-5 text-emerald-500" />,
  VIDEO: <Video className="h-5 w-5 text-purple-500" />,
  PDF: <FileText className="h-5 w-5 text-red-500" />,
  AUDIO: <Music className="h-5 w-5 text-amber-500" />,
};

const fileBgColors: Record<FileType, string> = {
  IMAGE: "bg-emerald-500/10",
  VIDEO: "bg-purple-500/10",
  PDF: "bg-red-500/10",
  AUDIO: "bg-amber-500/10",
};

interface FileCardProps {
  file: FileItem;
  onRename: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

export function FileCard({
  file,
  onRename,
  onDelete,
  onDownload,
}: FileCardProps) {
  return (
    <Card className="group relative p-4 transition-all hover:shadow-md hover:border-primary/30 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${fileBgColors[file.fileType]}`}
          >
            {fileIcons[file.fileType] || (
              <File className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {file.sizeMB.toFixed(2)} MB ·{" "}
              {format(new Date(file.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" /> Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onRename}>
              <Pencil className="h-4 w-4 mr-2" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
