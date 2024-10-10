import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ymirApi = createApi({
  reducerPath: "ymirApi",
  tagTypes: ["ymir"],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.YMIR_BASE_URL,
    prepareHeaders: (headers) => {
      const token = process.env.YMIR_KEY;

      headers.set("Token", `Bearer ${token}`);
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

    getYmirAccountTitleAllApi: builder.query({
      query: () => `/account_titles?status=active&pagination=none&vladimir=sync`,
    }),

    getYmirSupplierAllApi: builder.query({
      query: () => `/suppliers?status=active&pagination=none&vladimir=sync`,
    }),

    getYmirUnitOfMeasurementAllApi: builder.query({
      query: () => `/uoms?status=active&pagination=none&vladimir=sync`,
    }),

    getYmirItemsAllApi: builder.query({
      query: () => `/items?type=4&vladimir=sync&status=active&pagination=none`,
    }),

    getYmirSmallToolsAllApi: builder.query({
      query: () => `/small_tools?status=active&pagination=none&vladimir=sync`,
    }),

    getYmirReceivingAllApi: builder.query({
      query: () => `/asset_vladimir`,
    }),

    postPrYmirApi: builder.mutation({
      query: (data) => ({
        // url: "http://10.10.13.6:8080/api/asset_sync",
        url: `/asset_sync`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ymir"],
    }),

    patchPrYmirApi: builder.mutation({
      query: (data) => ({
        url: `/resubmit_pr_asset/${data.pr_number}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ymir"],
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
  useGetYmirAccountTitleAllApiQuery,
  useLazyGetYmirAccountTitleAllApiQuery,
  useGetYmirLocationAllApiQuery,
  useLazyGetYmirLocationAllApiQuery,
  useGetYmirUnitOfMeasurementAllApiQuery,
  useGetYmirSupplierAllApiQuery,
  useLazyGetYmirSupplierAllApiQuery,
  useLazyGetYmirUnitOfMeasurementAllApiQuery,
  useLazyGetYmirReceivingAllApiQuery,
  usePostPrYmirApiMutation,
  useLazyGetYmirSmallToolsAllApiQuery,
  useLazyGetYmirItemsAllApiQuery,
  usePatchPrYmirApiMutation,
} = ymirApi;
