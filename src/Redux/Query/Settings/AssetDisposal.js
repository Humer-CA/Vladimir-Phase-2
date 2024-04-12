import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const assetDisposalApi = createApi({
  reducerPath: "assetDisposalApi",
  tagTypes: ["AssetDisposal"],

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
    getAssetDisposalApi: builder.query({
      query: (params) =>
        `asset-disposal-approver?search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["AssetDisposal"],
    }),

    getAssetDisposalAllApi: builder.query({
      query: () => `/asset-disposal-approver?pagination=none`,
      transformResponse: (response) => response.data,
      providesTags: ["AssetDisposal"],
    }),

    getAssetDisposalIdApi: builder.query({
      query: (id) => `/asset-disposal-approver/${id}`,
    }),

    postAssetDisposalStatusApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/asset-disposal-approver/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AssetDisposal"],
    }),

    postAssetDisposalApi: builder.mutation({
      query: (data) => ({
        url: `/asset-disposal-approver`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AssetDisposal"],
    }),

    arrangeAssetDisposalApi: builder.mutation({
      query: ({ subunit_id, ...data }) => ({
        url: `/update-disposal-approver/${subunit_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AssetDisposal"],
    }),

    // deleteAssetDisposalApi: builder.mutation({
    //   query: (id) => ({
    //     url: `/asset-disposal-approver/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["AssetDisposal"],
    // }),

    deleteAssetDisposalApi: builder.mutation({
      query: ({ subunit_id }) => ({
        url: `/asset-disposal-approver/${subunit_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AssetDisposal"],
    }),

    getApproversApi: builder.query({
      query: () => `/setup-approver`,
      // transformResponse: (response) => response.data,
      providesTags: ["AssetDisposal"],
    }),
  }),
});

export const {
  useGetAssetDisposalApiQuery,
  useGetAssetDisposalAllApiQuery,
  useGetAssetDisposalIdApiQuery,
  usePostAssetDisposalStatusApiMutation,
  usePostAssetDisposalApiMutation,
  useArrangeAssetDisposalApiMutation,
  useDeleteAssetDisposalApiMutation,
  useGetApproversApiQuery,
} = assetDisposalApi;
