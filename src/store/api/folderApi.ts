import { baseApi } from "./baseApi";
import type { ApiResponse, Folder, FolderChildrenData } from "@/types";

export const folderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRootFolders: builder.query<ApiResponse<Folder[]>, void>({
      query: () => "/folders",
      providesTags: ["Folder"],
    }),
    getFolderChildren: builder.query<ApiResponse<FolderChildrenData>, string>({
      query: (id) => `/folders/${id}/children`,
      providesTags: ["Folder", "File"],
    }),
    createFolder: builder.mutation<
      ApiResponse<Folder>,
      { name: string; parentId?: string | null }
    >({
      query: (body) => ({ url: "/folders", method: "POST", body }),
      invalidatesTags: ["Folder"],
    }),
    renameFolder: builder.mutation<
      ApiResponse<Folder>,
      { id: string; name: string }
    >({
      query: ({ id, name }) => ({
        url: `/folders/${id}`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["Folder"],
    }),
    deleteFolder: builder.mutation<
      ApiResponse<{ deleted: boolean; folderId: string }>,
      string
    >({
      query: (id) => ({ url: `/folders/${id}`, method: "DELETE" }),
      invalidatesTags: ["Folder"],
    }),
  }),
});

export const {
  useGetRootFoldersQuery,
  useGetFolderChildrenQuery,
  useCreateFolderMutation,
  useRenameFolderMutation,
  useDeleteFolderMutation,
} = folderApi;
