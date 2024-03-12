import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const minorCategoryApi = createApi({
  reducerPath: "minorCategoryApi",
  tagTypes: ["minorCategory"],

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
    getMinorCategoryApi: builder.query({
      query: (params) =>
        `/minor-category?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["minorCategory"],
    }),

    getMinorCategoryAllApi: builder.query({
      query: (id) => `/minor-category?pagination=none/`,
      providesTags: ["minorCategory"],
    }),

    getMinorCategoryIdApi: builder.query({
      query: (id) => `/minor-category/${id}/`,
      providesTags: ["minorCategory"],
    }),

    putMinorCategoryStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/minor-category/archived-minor-category/${id}`,
        method: "PUT",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["minorCategory"],
    }),

    postMinorCategoryApi: builder.mutation({
      query: (data) => ({
        url: `/minor-category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["minorCategory"],
    }),

    updateMinorCategoryApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/minor-category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["minorCategory"],
    }),
  }),
});

export const {
  useGetMinorCategoryApiQuery,
  useGetMinorCategoryAllApiQuery,
  useGetMinorCategoryIdApiQuery,
  usePutMinorCategoryStatusApiMutation,
  usePostMinorCategoryApiMutation,
  useUpdateMinorCategoryApiMutation,
} = minorCategoryApi;
