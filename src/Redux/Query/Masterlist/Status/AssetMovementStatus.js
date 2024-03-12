import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const assetMovementStatusApi = createApi({
  reducerPath: "assetMovementStatusApi",
  tagTypes: ["AssetMovementStatus"],

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
    getAssetMovementStatusApi: builder.query({
      query: (params) =>
        `movement-status?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["AssetMovementStatus"],
    }),

    getAssetMovementStatusAllApi: builder.query({
      query: () => `movement-status?pagination=none`,
      transformResponse: (response) => response,
      providesTags: ["AssetMovementStatus"],
    }),

    getAssetMovementStatusIdApi: builder.query({
      query: (id) => `movement-status/${id}`,
    }),

    patchAssetMovementStatusStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/movement-status/archived-movement-status/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["AssetMovementStatus"],
    }),

    postAssetMovementStatusApi: builder.mutation({
      query: (data) => ({
        url: `/movement-status`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AssetMovementStatus"],
    }),

    updateAssetMovementStatusApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/movement-status/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AssetMovementStatus"],
    }),
  }),
});

export const {
  useGetAssetMovementStatusApiQuery,
  useGetAssetMovementStatusAllApiQuery,
  useGetAssetMovementStatusIdApiQuery,
  usePatchAssetMovementStatusStatusApiMutation,
  usePostAssetMovementStatusApiMutation,
  useUpdateAssetMovementStatusApiMutation,
} = assetMovementStatusApi;
