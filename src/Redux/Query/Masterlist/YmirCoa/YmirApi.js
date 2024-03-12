import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ymirApi = createApi({
  reducerPath: "ymirApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.10.17:8000/api",
    prepareHeaders: (headers) => {
      const token = "33|nRbzIxaxXQOnGcnMvUhdp01STUuY3k7bggGX8Xds";
      // const token = process.env.YMIR_KEY;

      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", `application/json`);

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getYmirCompanyAllApi: builder.query({
      query: () => `/companies?status=active&pagination=none&vladimir=sync`,
    }),

    getYmirBusinessUnitAllApi: builder.query({
      query: () => `/business-units?status=active&pagination=none&vladimir=sync`,
    }),

    getYmirDepartmentAllApi: builder.query({
      query: () => `/departments?status=active&pagination=none&vladimir=sync`,
    }),

    getYmirUnitAllApi: builder.query({
      query: () => `/units_department?status=active&pagination=none&vladimir=sync`,
    }),

    getYmirSubUnitAllApi: builder.query({
      query: () => `/sub_units?status=active&pagination=none&vladimir=sync`,
    }),

    getYmirLocationAllApi: builder.query({
      query: () => `/locations?status=active&pagination=none&vladimir=sync`,
    }),
  }),
});

export const {
  useGetYmirCompanyAllApiQuery,
  useLazyGetYmirCompanyAllApiQuery,
  useGetYmirBusinessUnitAllApiQuery,
  useLazyGetYmirBusinessUnitAllApiQuery,
  useGetYmirDepartmentAllApiQuery,
  useLazyGetYmirDepartmentAllApiQuery,
  useGetYmirUnitAllApiQuery,
  useLazyGetYmirUnitAllApiQuery,
  useGetYmirSubUnitAllApiQuery,
  useLazyGetYmirSubUnitAllApiQuery,
  useGetYmirLocationAllApiQuery,
  useLazyGetYmirLocationAllApiQuery,
} = ymirApi;
