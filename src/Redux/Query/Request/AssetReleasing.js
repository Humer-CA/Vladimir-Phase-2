import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const assetReleasingApi = createApi({
  reducerPath: "assetReleasing",
  tagTypes: ["AssetReleasing"],

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
    getAssetReleasing: builder.query({
      query: (params) =>
        `asset-release?isReleased=${params.released}&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["AssetReleasing"],
    }),

    getAssetReleasingAllApi: builder.query({
      query: () => `asset-release?pagination=none`,
      providesTags: ["AssetReleasing"],
    }),

    getByWarehouseNumberApi: builder.query({
      query: (data) => `asset-release/${data?.warehouse_number}`,
      providesTags: ["AssetReleasing"],
    }),

    putAssetReleasing: builder.mutation({
      query: (data) => ({
        url: `/release-assets`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AssetReleasing"],
    }),
  }),
});

export const {
  useGetAssetReleasingQuery,
  useGetAssetReleasingAllApiQuery,
  useLazyGetAssetReleasingAllApiQuery,
  useGetByWarehouseNumberApiQuery,
  useLazyGetAssetReleasingQuery,
  usePutAssetReleasingMutation,
} = assetReleasingApi;
