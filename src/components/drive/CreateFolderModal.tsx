/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateFolderMutation } from "@/store/api/folderApi";
import { toast } from "sonner";

const schema = z.object({ name: z.string().trim().min(1, "Folder name is required").max(100) });
type FormData = z.infer<typeof schema>;

interface CreateFolderModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  parentId?: string | null;
}

export function CreateFolderModal({ open, onOpenChange, parentId }: CreateFolderModalProps) {
  const [createFolder, { isLoading }] = useCreateFolderMutation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await createFolder({ name: data.name, parentId: parentId || null }).unwrap();
      toast.success(res.message || "Folder created");
      reset();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create folder");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Create New Folder</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input id="folder-name" placeholder="My Folder" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
