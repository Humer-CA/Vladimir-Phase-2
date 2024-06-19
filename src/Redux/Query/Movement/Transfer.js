import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transferApi = createApi({
  reducerPath: "transferApi",
  tagTypes: ["Transfer"],

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
    getTransferApi: builder.query({
      query: (params) =>
        `asset-transfer?per_page=${params.per_page}&page=${params.page}&search=${params.search}&status=${params.status}`,
      providesTags: ["Transfer"],
    }),

    getTransferAllApi: builder.query({
      query: () => `asset-transfer?pagination=none`,
    }),

    getTransferNumberApi: builder.query({
      query: (params) => `asset-transfer/${params.transfer_number}`,
    }),

    getFixedAssetTransferAllApi: builder.query({
      query: () => `fixed-asset?pagination=none&movement=transfer`,
      transformResponse: (response) => response.data,
      providesTags: ["Transfer"],
    }),

    getTransferApprovalApi: builder.query({
      query: (params) =>
        `transfer-approver?page=${params.page}&per_page=${params.per_page}&search=${params.search}&status=${params.status}`,
      providesTags: ["Transfer"],
    }),

    postTransferApi: builder.mutation({
      query: (data) => ({
        url: `asset-transfer`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transfer"],
    }),

    archiveTransferApi: builder.mutation({
      query: (transfer_number) => ({
        url: `remove-transfer-item/${transfer_number}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transfer"],
    }),

    downloadAttachmentApi: builder.mutation({
      query: (transfer_number) => ({
        url: `transfer-attachment/${transfer_number}`,
      }),
      invalidatesTags: ["Transfer"],
    }),
  }),
});

export const {
  useGetTransferApiQuery,
  useLazyGetTransferAllApiQuery,
  useGetTransferNumberApiQuery,
  useLazyGetFixedAssetTransferAllApiQuery,
  useGetTransferAllApiQuery,
  useGetTransferApprovalApiQuery,
  usePostTransferApiMutation,
  useArchiveTransferApiMutation,
  useDownloadAttachmentApiMutation,
} = transferApi;
