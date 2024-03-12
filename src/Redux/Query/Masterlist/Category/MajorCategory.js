import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const majorCategoryApi = createApi({
  reducerPath: "majorCategoryApi",
  tagTypes: ["majorCategory"],

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
    getMajorCategoryApi: builder.query({
      query: (params) =>
        `/major-category?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["majorCategory"],
    }),

    getMajorCategoryAllApi: builder.query({
      query: (id) => `/major-category?pagination=none/`,
      transformResponse: (response) => response.data,
      providesTags: ["majorCategory"],
    }),

    getMajorCategoryIdApi: builder.query({
      query: (id) => `/major-category/${id}/`,
      providesTags: ["majorCategory"],
    }),

    putMajorCategoryStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/major-category/archived-major-category/${id}`,
        method: "PUT",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["majorCategory"],
    }),

    postMajorCategoryApi: builder.mutation({
      query: (data) => ({
        url: `/major-category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["majorCategory"],
    }),

    updateMajorCategoryApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/major-category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["majorCategory"],
    }),
  }),
});

export const {
  useGetMajorCategoryApiQuery,
  useGetMajorCategoryAllApiQuery,
  useGetMajorCategoryIdApiQuery,
  usePutMajorCategoryStatusApiMutation,
  usePostMajorCategoryApiMutation,
  useUpdateMajorCategoryApiMutation,
} = majorCategoryApi;
