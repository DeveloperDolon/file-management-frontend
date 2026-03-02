/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUploadFileMutation } from "@/store/api/fileApi";
import { toast } from "sonner";

interface FileUploadZoneProps {
  folderId: string;
}

export function FileUploadZone({ folderId }: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const [progress, setProgress] = useState(0);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      setProgress(30);
      try {
        const res = await uploadFile({ folderId, file }).unwrap();
        setProgress(100);
        toast.success(res.message || "File uploaded successfully");
      } catch (err: any) {
        toast.error(err?.data?.message || "Upload failed");
      } finally {
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [folderId, uploadFile],
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragOver ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        aria-label="Upload file"
      />
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag & drop a file here, or
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Browse Files"}
        </Button>
      </div>
      {progress > 0 && (
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
}
