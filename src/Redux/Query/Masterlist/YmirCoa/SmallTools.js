import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const smallToolsApi = createApi({
  reducerPath: "smallTools",
  tagTypes: ["SmallTools"],

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
    getSmallToolsApi: builder.query({
      query: (params) =>
        `/small-tools?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["SmallTools"],
    }),

    getSmallToolsAllApi: builder.query({
      query: () => `/small-tools?pagination=none`,
      // transformResponse: (response) => response,
      providesTags: ["SmallTools"],
    }),

    postSmallToolsApi: builder.mutation({
      query: (data) => ({
        url: `/small-tools`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SmallTools"],
    }),
  }),
});

export const {
  useGetSmallToolsApiQuery,
  useGetSmallToolsAllApiQuery,
  useLazyGetSmallToolsAllApiQuery,
  usePostSmallToolsApiMutation,
} = smallToolsApi;
