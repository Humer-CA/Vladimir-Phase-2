import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pulloutApprovalApi = createApi({
  reducerPath: "pulloutApprovalApi",
  tagTypes: ["PulloutApproval"],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VLADIMIR_BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", `application/json`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getPulloutApprovalApi: builder.query({
      query: (params) =>
        `asset-pullout-approval?=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["PulloutApproval"],
    }),

    getPulloutApprovalAllApi: builder.query({
      query: () => `asset-pullout-approval?pagination=none`,
      transformResponse: (response) => response.data,
      providesTags: ["PulloutApproval"],
    }),

    getPulloutApprovalIdApi: builder.query({
      query: (params) => `asset-pullout-approval/${params.id}?page=${params.page}&per_page=${params.per_page}`,
    }),

    patchPulloutApprovalStatusApi: builder.mutation({
      query: (body) => ({
        url: `/pullout-approval`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PulloutApproval"],
    }),

    getNextRequest: builder.query({
      query: () => `/next-pullout`,
    }),

    dlAttachment: builder.query({
      query: (params) => ({
        url: `/dl?attachment=${params.attachment}&id=${params.id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetPulloutApprovalApiQuery,
  useGetPulloutApprovalAllApiQuery,
  useGetPulloutApprovalIdApiQuery,
  usePatchPulloutApprovalStatusApiMutation,
  useGetNextRequestQuery,
  useLazyGetNextRequestQuery,
  useLazyDlAttachmentQuery,
} = pulloutApprovalApi;
