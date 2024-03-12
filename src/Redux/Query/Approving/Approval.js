import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const approvalApi = createApi({
  reducerPath: "approvalApi",
  tagTypes: ["Approval"],

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
    getApprovalApi: builder.query({
      query: (params) =>
        `asset-approval?=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["Approval"],
    }),

    getApprovalAllApi: builder.query({
      query: () => `asset-approval?pagination=none`,
      transformResponse: (response) => response.data,
      providesTags: ["Approval"],
    }),

    getApprovalIdApi: builder.query({
      query: (params) => `asset-approval/${params.id}?page=${params.page}&per_page=${params.per_page}`,
    }),

    patchApprovalStatusApi: builder.mutation({
      query: (body) => ({
        url: `/handle-request`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Approval"],
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
  useGetApprovalApiQuery,
  useGetApprovalAllApiQuery,
  useGetApprovalIdApiQuery,
  usePatchApprovalStatusApiMutation,
  useGetNextRequestQuery,
  useLazyGetNextRequestQuery,
  useLazyDlAttachmentQuery,
} = approvalApi;
