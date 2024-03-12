import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  tagTypes: ["Supplier"],

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
    getSupplierApi: builder.query({
      query: (params) =>
        `supplier?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["Supplier"],
    }),

    getSupplierAllApi: builder.query({
      query: () => `supplier?pagination=none`,
      providesTags: ["Supplier"],
    }),

    postSupplierApi: builder.mutation({
      query: (data) => ({
        url: `/supplier`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Supplier"],
    }),
  }),
});

export const { useGetSupplierApiQuery, useGetSupplierAllApiQuery, usePostSupplierApiMutation } = supplierApi;
