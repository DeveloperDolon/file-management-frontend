import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { SubscriptionPackage, FileType, SubscriptionTier } from "@/types";

const FILE_TYPES: FileType[] = ["IMAGE", "VIDEO", "PDF", "AUDIO"];
const TIER_NAMES: SubscriptionTier[] = ["FREE", "SILVER", "GOLD", "DIAMOND"];

const schema = z.object({
  name: z.enum(["FREE", "SILVER", "GOLD", "DIAMOND"]),
  price: z.preprocess(
    (v) => Number(v),
    z.number().min(0, "Price must be 0 or more"),
  ),
  maxFolders: z.preprocess((v) => Number(v), z.number().min(1, "Min 1 folder")),
  maxNestingLevel: z.preprocess(
    (v) => Number(v),
    z.number().min(1, "Min level 1"),
  ),
  maxFileSizeMB: z.preprocess((v) => Number(v), z.number().min(1, "Min 1 MB")),
  totalFileLimit: z.preprocess(
    (v) => Number(v),
    z.number().min(1, "Min 1 file"),
  ),
  filesPerFolder: z.preprocess(
    (v) => Number(v),
    z.number().min(1, "Min 1 file per folder"),
  ),
  allowedFileTypes: z
    .array(z.enum(["IMAGE", "VIDEO", "PDF", "AUDIO"]))
    .min(1, "Select at least one file type"),
});

type FormData = z.infer<typeof schema>;

interface PackageFormModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  pkg?: SubscriptionPackage | null;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function PackageFormModal({
  open,
  onOpenChange,
  pkg,
  onSubmit,
  isLoading,
}: PackageFormModalProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: pkg
      ? {
          name: pkg.name,
          price: pkg.price,
          maxFolders: pkg.maxFolders,
          maxNestingLevel: pkg.maxNestingLevel,
          maxFileSizeMB: pkg.maxFileSizeMB,
          totalFileLimit: pkg.totalFileLimit,
          filesPerFolder: pkg.filesPerFolder,
          allowedFileTypes: pkg.allowedFileTypes,
        }
      : {
          name: "FREE",
          price: 0,
          maxFolders: 5,
          maxNestingLevel: 2,
          maxFileSizeMB: 10,
          totalFileLimit: 20,
          filesPerFolder: 5,
          allowedFileTypes: ["IMAGE"],
        },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pkg ? "Edit Package" : "Create Package"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Tier</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIER_NAMES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Price ($)</Label>
              <Input type="number" step="0.01" {...register("price")} />
              {errors.price && (
                <p className="text-xs text-destructive mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
            <div>
              <Label>Max Folders</Label>
              <Input type="number" {...register("maxFolders")} />
              {errors.maxFolders && (
                <p className="text-xs text-destructive mt-1">
                  {errors.maxFolders.message}
                </p>
              )}
            </div>
            <div>
              <Label>Nesting Level</Label>
              <Input type="number" {...register("maxNestingLevel")} />
              {errors.maxNestingLevel && (
                <p className="text-xs text-destructive mt-1">
                  {errors.maxNestingLevel.message}
                </p>
              )}
            </div>
            <div>
              <Label>Max File Size (MB)</Label>
              <Input type="number" {...register("maxFileSizeMB")} />
              {errors.maxFileSizeMB && (
                <p className="text-xs text-destructive mt-1">
                  {errors.maxFileSizeMB.message}
                </p>
              )}
            </div>
            <div>
              <Label>Total File Limit</Label>
              <Input type="number" {...register("totalFileLimit")} />
              {errors.totalFileLimit && (
                <p className="text-xs text-destructive mt-1">
                  {errors.totalFileLimit.message}
                </p>
              )}
            </div>
            <div>
              <Label>Files per Folder</Label>
              <Input type="number" {...register("filesPerFolder")} />
              {errors.filesPerFolder && (
                <p className="text-xs text-destructive mt-1">
                  {errors.filesPerFolder.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Allowed File Types</Label>
            <Controller
              name="allowedFileTypes"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-3 mt-2">
                  {FILE_TYPES.map((ft) => (
                    <label
                      key={ft}
                      className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                      <Checkbox
                        checked={field.value.includes(ft)}
                        onCheckedChange={(checked) => {
                          if (checked) field.onChange([...field.value, ft]);
                          else
                            field.onChange(field.value.filter((v) => v !== ft));
                        }}
                      />
                      {ft}
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.allowedFileTypes && (
              <p className="text-xs text-destructive mt-1">
                {errors.allowedFileTypes.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
