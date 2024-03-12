import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const businessUnitApi = createApi({
  reducerPath: "businessUnitApi",
  tagTypes: ["BusinessUnit"],

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
    getBusinessUnitApi: builder.query({
      query: (params) =>
        `/business-unit?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["BusinessUnit"],
    }),

    getBusinessUnitAllApi: builder.query({
      query: () => `/business-unit?pagination=none`,
    }),

    postBusinessUnitApi: builder.mutation({
      query: (data) => ({
        url: `/business-unit`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BusinessUnit"],
    }),
  }),
});

export const { useGetBusinessUnitApiQuery, useGetBusinessUnitAllApiQuery, usePostBusinessUnitApiMutation } =
  businessUnitApi;
