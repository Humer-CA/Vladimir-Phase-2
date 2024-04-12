import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const assetPulloutApi = createApi({
  reducerPath: "assetPulloutApi",
  tagTypes: ["AssetPullout"],

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
    getAssetPulloutApi: builder.query({
      query: (params) =>
        `asset-pullout-approver?search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["AssetPullout"],
    }),

    getAssetPulloutAllApi: builder.query({
      query: () => `/asset-pullout-approver?pagination=none`,
      transformResponse: (response) => response.data,
      providesTags: ["AssetPullout"],
    }),

    getAssetPulloutIdApi: builder.query({
      query: (id) => `/asset-pullout-approver/${id}`,
    }),

    postAssetPulloutStatusApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/asset-pullout-approver/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AssetPullout"],
    }),

    postAssetPulloutApi: builder.mutation({
      query: (data) => ({
        url: `/asset-pullout-approver`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AssetPullout"],
    }),

    arrangeAssetPulloutApi: builder.mutation({
      query: ({ subunit_id, ...data }) => ({
        url: `/update-pullout-approver/${subunit_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AssetPullout"],
    }),

    // deleteAssetPulloutApi: builder.mutation({
    //   query: (id) => ({
    //     url: `/asset-pullout-approver/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["AssetPullout"],
    // }),

    deleteAssetPulloutApi: builder.mutation({
      query: ({ subunit_id }) => ({
        url: `/asset-pullout-approver/${subunit_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AssetPullout"],
    }),

    getApproversApi: builder.query({
      query: () => `/setup-approver`,
      // transformResponse: (response) => response.data,
      providesTags: ["AssetPullout"],
    }),
  }),
});

export const {
  useGetAssetPulloutApiQuery,
  useGetAssetPulloutAllApiQuery,
  useGetAssetPulloutIdApiQuery,
  usePostAssetPulloutStatusApiMutation,
  usePostAssetPulloutApiMutation,
  useArrangeAssetPulloutApiMutation,
  useDeleteAssetPulloutApiMutation,
  useGetApproversApiQuery,
} = assetPulloutApi;
