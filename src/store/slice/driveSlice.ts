import type { BreadcrumbItem } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface DriveState {
  currentFolderId: string | null;
  breadcrumbs: BreadcrumbItem[];
  viewMode: "grid" | "list";
}

const initialState: DriveState = {
  currentFolderId: null,
  breadcrumbs: [],
  viewMode: "grid",
};

const driveSlice = createSlice({
  name: "drive",
  initialState,
  reducers: {
    setCurrentFolder(state, action: PayloadAction<string | null>) {
      state.currentFolderId = action.payload;
    },
    setBreadcrumbs(state, action: PayloadAction<BreadcrumbItem[]>) {
      state.breadcrumbs = action.payload;
    },
    pushBreadcrumb(state, action: PayloadAction<BreadcrumbItem>) {
      const idx = state.breadcrumbs.findIndex((b) => b.id === action.payload.id);
      if (idx >= 0) {
        state.breadcrumbs = state.breadcrumbs.slice(0, idx + 1);
      } else {
        state.breadcrumbs.push(action.payload);
      }
    },
    setViewMode(state, action: PayloadAction<"grid" | "list">) {
      state.viewMode = action.payload;
    },
    resetDrive(state) {
      state.currentFolderId = null;
      state.breadcrumbs = [];
    },
  },
});

export const { setCurrentFolder, setBreadcrumbs, pushBreadcrumb, setViewMode, resetDrive } = driveSlice.actions;
export default driveSlice.reducer;
