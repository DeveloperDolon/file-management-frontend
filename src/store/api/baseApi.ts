import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  API_BASE_URL,
  ACCESS_TOKEN_KEY,
  ADMIN_TOKEN_KEY,
} from "@/lib/constants";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { endpoint }) => {
      const isAdmin =
        endpoint?.startsWith("admin") || endpoint?.startsWith("getAdmin");
      const token = isAdmin
        ? localStorage.getItem(ADMIN_TOKEN_KEY)
        : localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Folder", "File", "Package", "Subscription", "Auth"],
  endpoints: () => ({}),
});

