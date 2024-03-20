import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const departmentApi = createApi({
  reducerPath: "departmentApi",
  tagTypes: ["Department"],

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
    getDepartmentApi: builder.query({
      query: (params) =>
        `/department?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["Department"],
    }),

    getDepartmentAllApi: builder.query({
      query: () => `/department?pagination=none`,
      transformResponse: (response) => response,
      providesTags: ["Department"],
    }),

    postDepartmentApi: builder.mutation({
      query: (data) => ({
        url: `/department`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const { useGetDepartmentApiQuery, useGetDepartmentAllApiQuery, usePostDepartmentApiMutation } = departmentApi;
