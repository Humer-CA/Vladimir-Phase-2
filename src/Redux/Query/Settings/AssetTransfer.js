import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const assetTransferApi = createApi({
  reducerPath: "assetTransferApi",
  tagTypes: ["AssetTransfer"],

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
    getAssetTransferApi: builder.query({
      query: (params) =>
        `asset-transfer-approver?search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["AssetTransfer"],
    }),

    getAssetTransferAllApi: builder.query({
      query: () => `/asset-transfer-approver?pagination=none`,
      transformResponse: (response) => response.data,
      providesTags: ["AssetTransfer"],
    }),

    getAssetTransferIdApi: builder.query({
      query: (id) => `/asset-transfer-approver/${id}`,
    }),

    postAssetTransferStatusApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/asset-transfer-approver/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AssetTransfer"],
    }),

    postAssetTransferApi: builder.mutation({
      query: (data) => ({
        url: `/asset-transfer-approver`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AssetTransfer"],
    }),

    arrangeAssetTransferApi: builder.mutation({
      query: ({ subunit_id, ...data }) => ({
        url: `/update-transfer-approver/${subunit_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AssetTransfer"],
    }),

    // deleteAssetTransferApi: builder.mutation({
    //   query: (id) => ({
    //     url: `/asset-transfer-approver/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["AssetTransfer"],
    // }),

    deleteAssetTransferApi: builder.mutation({
      query: ({ subunit_id }) => ({
        url: `/asset-transfer-approver/${subunit_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AssetTransfer"],
    }),

    getApproversApi: builder.query({
      query: () => `/setup-approver`,
      // transformResponse: (response) => response.data,
      providesTags: ["AssetTransfer"],
    }),
  }),
});

export const {
  useGetAssetTransferApiQuery,
  useGetAssetTransferAllApiQuery,
  useGetAssetTransferIdApiQuery,
  usePostAssetTransferStatusApiMutation,
  usePostAssetTransferApiMutation,
  useArrangeAssetTransferApiMutation,
  useDeleteAssetTransferApiMutation,
  useGetApproversApiQuery,
} = assetTransferApi;
