export type FileType = "IMAGE" | "VIDEO" | "PDF" | "AUDIO";
export type SubscriptionTier = "FREE" | "SILVER" | "GOLD" | "DIAMOND";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta: { page: number; limit: number; total: number } | null;
}

export interface SubscriptionPackage {
  id: string;
  name: SubscriptionTier;
  price: number;
  maxFolders: number;
  maxNestingLevel: number;
  allowedFileTypes: FileType[];
  maxFileSizeMB: number;
  totalFileLimit: number;
  filesPerFolder: number;
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  packageId: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  package: SubscriptionPackage;
}

export interface SubscriptionData {
  active: UserSubscription | null;
  history: UserSubscription[];
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  parentId: string | null;
  depth: number;
  createdAt: string;
  _count?: { children: number; files: number };
}

export interface FolderChildrenData {
  folder: { id: string; name: string; parentId: string | null; depth: number };
  subFolders: Folder[];
  files: FileItem[];
}

export interface FileItem {
  id: string;
  name: string;
  originalName: string;
  userId?: string;
  folderId: string;
  fileType: FileType;
  mimeType: string;
  sizeMB: number;
  storageUrl: string;
  storageKey?: string;
  createdAt: string;
  folder?: { id: string; name: string };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}
