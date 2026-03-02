import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  pushBreadcrumb,
  setViewMode,
  resetDrive,
} from "../store/slice/driveSlice";
import type { BreadcrumbItem } from "@/types";

export function useDrive() {
  const dispatch = useDispatch<AppDispatch>();
  const { breadcrumbs, viewMode } = useSelector((s: RootState) => s.drive);

  return {
    breadcrumbs,
    viewMode,
    navigateToFolder: (item: BreadcrumbItem) => dispatch(pushBreadcrumb(item)),
    toggleView: () =>
      dispatch(setViewMode(viewMode === "grid" ? "list" : "grid")),
    reset: () => dispatch(resetDrive()),
  };
}
