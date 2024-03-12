import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fistoSupplierApi = createApi({
  reducerPath: "fistoSupplierApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.2.76:8000/api",
    prepareHeaders: (headers) => {
      const token = process.env.FISTO_KEY;

      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", `application/json`);

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getFistoSupplierAllApi: builder.query({
      query: () => `/dropdown/suppliers?paginate=0&api_for=vladimir`,
    }),
  }),
});

export const { useGetFistoSupplierAllApiQuery, useLazyGetFistoSupplierAllApiQuery } = fistoSupplierApi;
