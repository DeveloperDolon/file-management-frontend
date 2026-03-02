import { baseApi } from "./baseApi";
import type { ApiResponse, FileItem } from "@/types";

export const fileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<
      ApiResponse<FileItem>,
      { folderId: string; file: File }
    >({
      query: ({ folderId, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folderId", folderId);
        return { url: "/files/upload", method: "POST", body: formData };
      },
      invalidatesTags: ["File", "Folder"],
    }),
    getFile: builder.query<ApiResponse<FileItem>, string>({
      query: (id) => `/files/${id}`,
      providesTags: ["File"],
    }),
    renameFile: builder.mutation<
      ApiResponse<FileItem>,
      { id: string; name: string }
    >({
      query: ({ id, name }) => ({
        url: `/files/${id}`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["File", "Folder"],
    }),
    deleteFile: builder.mutation<
      ApiResponse<{ deleted: boolean; fileId: string }>,
      string
    >({
      query: (id) => ({ url: `/files/${id}`, method: "DELETE" }),
      invalidatesTags: ["File", "Folder"],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useGetFileQuery,
  useRenameFileMutation,
  useDeleteFileMutation,
} = fileApi;
