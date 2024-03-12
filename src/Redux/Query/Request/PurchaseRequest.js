import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseRequestApi = createApi({
  reducerPath: "purchaseRequestApi",
  tagTypes: ["PurchaseRequest"],

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
    getPurchaseRequestApi: builder.query({
      query: (params) =>
        `adding-pr?toPr=1&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["PurchaseRequest"],
    }),

    getPurchaseRequestWithPrApi: builder.query({
      query: (params) =>
        `adding-pr?toPr=0&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["PurchaseRequest"],
    }),

    getPurchaseRequestAllApi: builder.query({
      query: () => `asset-request?pagination=none`,
      // transformResponse: (response) => response.data,
      providesTags: ["PurchaseRequest"],
    }),

    getItemPerPrApi: builder.query({
      query: (params) => `adding-pr/${params?.transaction_number}?per_page=${params.per_page}&page=${params.page}`,
      providesTags: ["PurchaseRequest"],
    }),

    addPurchaseRequestApi: builder.mutation({
      query: (data) => ({
        url: `/adding-pr/${data?.transaction_number}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PurchaseRequest"],
    }),

    removePurchaseRequestApi: builder.mutation({
      query: (body) => ({
        url: `/remove-pr/${body?.transaction_number}`,
        method: "PUT",
      }),
      invalidatesTags: ["PurchaseRequest"],
    }),
  }),
});

export const {
  useGetPurchaseRequestApiQuery,
  useGetPurchaseRequestWithPrApiQuery,
  useGetPurchaseRequestAllApiQuery,
  useGetItemPerPrApiQuery,
  useLazyGetPurchaseRequestAllApiQuery,
  useLazyGetPurchaseRequestApiQuery,
  useAddPurchaseRequestApiMutation,
  useRemovePurchaseRequestApiMutation,
} = purchaseRequestApi;
