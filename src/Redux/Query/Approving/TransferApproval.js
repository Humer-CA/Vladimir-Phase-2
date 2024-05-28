import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transferApprovalApi = createApi({
  reducerPath: "transferApprovalApi",
  tagTypes: ["TransferApproval"],

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
    getTransferApprovalApi: builder.query({
      query: (params) =>
        `asset-transfer-approval?=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["TransferApproval"],
    }),

    getTransferApprovalAllApi: builder.query({
      query: () => `asset-transfer-approval?pagination=none`,
      transformResponse: (response) => response.data,
      providesTags: ["TransferApproval"],
    }),

    getTransferApprovalIdApi: builder.query({
      query: (params) => `asset-transfer-approval/${params.id}?page=${params.page}&per_page=${params.per_page}`,
    }),

    patchTransferApprovalStatusApi: builder.mutation({
      query: (body) => ({
        url: `/handle-request`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["TransferApproval"],
    }),

    getNextRequest: builder.query({
      query: () => `/next-request`,
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
  useGetTransferApprovalApiQuery,
  useGetTransferApprovalAllApiQuery,
  useGetTransferApprovalIdApiQuery,
  usePatchTransferApprovalStatusApiMutation,
  useGetNextRequestQuery,
  useLazyGetNextRequestQuery,
  useLazyDlAttachmentQuery,
} = transferApprovalApi;
