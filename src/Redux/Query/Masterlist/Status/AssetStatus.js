import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const assetStatusApi = createApi({
  reducerPath: "assetStatusApi",
  tagTypes: ["AssetStatus"],

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
    getAssetStatusApi: builder.query({
      query: (params) =>
        `asset-status?=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["AssetStatus"],
    }),

    getAssetStatusAllApi: builder.query({
      query: () => `asset-status?pagination=none`,
      transformResponse: (response) => response,
      providesTags: ["AssetStatus"],
    }),

    getAssetStatusIdApi: builder.query({
      query: (id) => `asset-status/${id}`,
    }),

    patchAssetStatusStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/asset-status/archived-asset-status/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["AssetStatus"],
    }),

    postAssetStatusApi: builder.mutation({
      query: (data) => ({
        url: `/asset-status`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AssetStatus"],
    }),

    updateAssetStatusApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/asset-status/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AssetStatus"],
    }),
  }),
});

export const {
  useGetAssetStatusApiQuery,
  useGetAssetStatusAllApiQuery,
  useGetAssetStatusIdApiQuery,
  usePatchAssetStatusStatusApiMutation,
  usePostAssetStatusApiMutation,
  useUpdateAssetStatusApiMutation,
} = assetStatusApi;
