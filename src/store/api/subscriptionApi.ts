import { baseApi } from "./baseApi";
import type { ApiResponse, SubscriptionData, UserSubscription } from "@/types";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMySubscription: builder.query<ApiResponse<SubscriptionData>, void>({
      query: () => "/subscriptions/my",
      providesTags: ["Subscription"],
    }),
    selectPackage: builder.mutation<ApiResponse<UserSubscription>, string>({
      query: (packageId) => ({
        url: `/subscriptions/select/${packageId}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const { useGetMySubscriptionQuery, useSelectPackageMutation } =
  subscriptionApi;
