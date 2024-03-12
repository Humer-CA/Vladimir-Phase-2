import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const unitApi = createApi({
  reducerPath: "unitApi",
  tagTypes: ["Unit"],

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
    getUnitApi: builder.query({
      query: (params) =>
        `/unit?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["Unit"],
    }),

    getUnitAllApi: builder.query({
      query: () => `/unit?pagination=none`,
    }),

    postUnitApi: builder.mutation({
      query: (data) => ({
        url: `/unit`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Unit"],
    }),
  }),
});

export const { useGetUnitApiQuery, useGetUnitAllApiQuery, usePostUnitApiMutation } = unitApi;
