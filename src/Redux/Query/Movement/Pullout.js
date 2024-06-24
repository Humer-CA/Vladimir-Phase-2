import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pulloutApi = createApi({
  reducerPath: "pulloutApi",
  tagTypes: ["Pullout"],

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
    getPulloutApi: builder.query({
      query: (params) =>
        `asset-pullout?per_page=${params.per_page}&page=${params.page}&search=${params.search}&status=${params.status}`,
      providesTags: ["Pullout"],
    }),

    getPulloutAllApi: builder.query({
      query: () => `asset-pullout?pagination=none`,
    }),

    getPulloutNumberApi: builder.query({
      query: (params) => `asset-pullout/${params.pullout_number}`,
    }),

    getFixedAssetPulloutAllApi: builder.query({
      query: () => `fixed-asset?pagination=none&movement=pullout`,
      transformResponse: (response) => response.data,
      providesTags: ["Pullout"],
    }),

    getPulloutApprovalApi: builder.query({
      query: (params) =>
        `pullout-approver?page=${params.page}&per_page=${params.per_page}&search=${params.search}&status=${params.status}`,
      providesTags: ["Pullout"],
    }),

    postPulloutApi: builder.mutation({
      query: (data) => ({
        url: `asset-pullout`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pullout"],
    }),

    archivePulloutApi: builder.mutation({
      query: (pullout_number) => ({
        url: `remove-pullout-item/${pullout_number}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pullout"],
    }),

    getNextPullout: builder.query({
      query: () => `/next-pullout`,
    }),

    downloadAttachmentApi: builder.mutation({
      query: (pullout_number) => ({
        url: `pullout-attachment/${pullout_number}`,
      }),
      invalidatesTags: ["Pullout"],
    }),
  }),
});

export const {
  useGetPulloutApiQuery,
  useLazyGetPulloutAllApiQuery,
  useGetPulloutNumberApiQuery,
  useLazyGetFixedAssetPulloutAllApiQuery,
  useGetPulloutAllApiQuery,
  useGetPulloutApprovalApiQuery,
  usePostPulloutApiMutation,
  useArchivePulloutApiMutation,
  useLazyGetNextPulloutQuery,
  useDownloadAttachmentApiMutation,
} = pulloutApi;
