import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fistoApi = createApi({
  reducerPath: "fistoApi",

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
    getFistoCompanyAllApi: builder.query({
      query: () => `/dropdown/company?status=all&paginate=0&api_for=vladimir`,
    }),

    getFistoBusinessUnitAllApi: builder.query({
      query: () => `/dropdown/business-unit?status=all&paginate=0&api_for=vladimir`,
    }),

    getFistoDepartmentAllApi: builder.query({
      query: () => `/dropdown/department?status=all&paginate=0&api_for=vladimir`,
    }),

    getFistoUnitAllApi: builder.query({
      query: () => `/dropdown/unit?status=all&paginate=0&api_for=vladimir`,
    }),

    getFistoLocationAllApi: builder.query({
      query: () => `/dropdown/location?status=all&paginate=0&api_for=vladimir`,
    }),

    getFistoSupplierAllApi: builder.query({
      query: () => `/dropdown/suppliers?paginate=0&api_for=vladimir`,
    }),

    getFistoAccountTitleAllApi: builder.query({
      query: () => `/dropdown/account-title?status=all&paginate=0&api_for=vladimir`,
    }),
  }),
});

export const {
  useGetFistoCompanyAllApiQuery,
  useLazyGetFistoCompanyAllApiQuery,
  useGetFistoBusinessUnitAllApiQuery,
  useLazyGetFistoBusinessUnitAllApiQuery,
  useGetFistoDepartmentAllApiQuery,
  useLazyGetFistoDepartmentAllApiQuery,
  useGetFistoUnitAllApiQuery,
  useLazyGetFistoUnitAllApiQuery,
  useGetFistoLocationAllApiQuery,
  useLazyGetFistoLocationAllApiQuery,
  useGetFistoSupplierAllApiQuery,
  useLazyGetFistoSupplierAllApiQuery,
  useGetFistoAccountTitleAllApiQuery,
  useLazyGetFistoAccountTitleAllApiQuery,
} = fistoApi;
