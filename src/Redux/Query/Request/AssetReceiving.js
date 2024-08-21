import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const assetReceivingApi = createApi({
  reducerPath: "assetReceivingApi",
  tagTypes: ["AssetReceiving"],

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
    getAssetReceivingApi: builder.query({
      query: (params) =>
        `adding-po?toPo=1&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["AssetReceiving"],
    }),

    getAssetReceivedApi: builder.query({
      query: (params) => {
        const queryParams = [`search=${params.search}`, `per_page=${params.per_page}`, `page=${params.page}`];

        if (params.from) queryParams.push(`from=${params.from}`);
        if (params.to) queryParams.push(`to=${params.to}`);

        const queryString = queryParams.join("&");
        return `/adding-po?toPo=0${queryString}`;
      },

      providesTags: ["AssetReceiving"],
    }),

    getAssetReceivingAllApi: builder.query({
      query: () => `adding-po?pagination=none`,
      // transformResponse: (response) => response.data,
      providesTags: ["AssetReceiving"],
    }),

    getItemPerTransactionApi: builder.query({
      query: (params) => `adding-po/${params?.transaction_number}?&per_page=${params.per_page}&page=${params.page}`,
      providesTags: ["AssetReceiving"],
    }),

    addAssetReceivingApi: builder.mutation({
      query: (data) => ({
        url: `/adding-po/${data?.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AssetReceiving"],
    }),

    cancelAssetReceivingApi: builder.mutation({
      query: ({ id, remarks }) => ({
        url: `/adding-po/${id}`,
        method: "DELETE",
        body: { remarks: remarks },
      }),
      invalidatesTags: ["AssetReceiving"],
    }),

    postReceivingSyncApi: builder.mutation({
      query: (body) => ({
        url: `/ymir-po-receiving`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["AssetReceiving"],
    }),

    putInclusionApi: builder.mutation({
      query: (body) => ({
        url: `/inclusion`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["AssetReceiving"],
    }),

    removeInclusionApi: builder.mutation({
      query: (body) => ({
        url: `/remove-inclusion`,
        method: "PATCH",
        body: body,
      }),
      invalidatesTags: ["AssetReceiving"],
    }),

    getRrSummaryApi: builder.query({
      query: (params) => ({
        url: `/rr-summary?${params?.search}&per_page=${params.per_page}&page=${params.page}`,
        transformResponse: (res) => res.data,
      }),
      invalidatesTags: ["AssetReceiving"],
    }),
  }),
});

export const {
  useGetAssetReceivingApiQuery,
  useGetAssetReceivedApiQuery,
  useGetAssetReceivingAllApiQuery,
  useGetItemPerTransactionApiQuery,
  useLazyGetAssetReceivingAllApiQuery,
  useLazyGetAssetReceivingApiQuery,
  useAddAssetReceivingApiMutation,
  useCancelAssetReceivingApiMutation,
  usePostReceivingSyncApiMutation,
  usePutInclusionApiMutation,
  useRemoveInclusionApiMutation,
  useGetRrSummaryApiQuery,
} = assetReceivingApi;
