import { baseApi } from "./baseApi";
import type { ApiResponse, Admin } from "@/types";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { email: string; password: string }
    >({
      query: (body) => ({ url: "/admin/login", method: "POST", body }),
    }),
    getAdminProfile: builder.query<ApiResponse<Admin>, void>({
      query: () => "/admin/profile",
    }),
  }),
});

export const { useAdminLoginMutation, useGetAdminProfileQuery } = adminApi;
