import { baseApi } from "./baseApi";
import type { ApiResponse, SubscriptionPackage } from "@/types";

export const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query<ApiResponse<SubscriptionPackage[]>, void>({
      query: () => "/packages",
      providesTags: ["Package"],
    }),
    adminCreatePackage: builder.mutation<
      ApiResponse<SubscriptionPackage>,
      Partial<SubscriptionPackage>
    >({
      query: (body) => ({ url: "/packages", method: "POST", body }),
      invalidatesTags: ["Package"],
    }),
    adminUpdatePackage: builder.mutation<
      ApiResponse<SubscriptionPackage>,
      { id: string; data: Partial<SubscriptionPackage> }
    >({
      query: ({ id, data }) => ({
        url: `/packages/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Package"],
    }),
    adminDeletePackage: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/packages/${id}`, method: "DELETE" }),
      invalidatesTags: ["Package"],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useAdminCreatePackageMutation,
  useAdminUpdatePackageMutation,
  useAdminDeletePackageMutation,
} = packageApi;
