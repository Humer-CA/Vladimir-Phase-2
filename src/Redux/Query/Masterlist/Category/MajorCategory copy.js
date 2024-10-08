import { createApi } from "@reduxjs/toolkit/query/react";

export const majorCategoryApi = createApi({
  reducerPath: "majorCategoryApi",
  tagTypes: ["majorCategory"],
  endpoints: (builder) => ({
    getMajorCategoryApi: builder.query({
      query: (params) =>
        `/major-category?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["majorCategory"],
    }),
    getMajorCategoryAllApi: builder.query({
      query: () => `/major-category?pagination=none`,
      providesTags: ["majorCategory"],
    }),
    getMajorCategoryIdApi: builder.query({
      query: (id) => `/major-category/${id}`,
      providesTags: ["majorCategory"],
    }),
    putMajorCategoryStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/major-category/archived-major-category/${id}`,
        method: "PUT",
        body: { status },
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
