import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const categoryListApi = createApi({
  reducerPath: "categoryListApi",
  tagTypes: ["categoryList"],

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
    getCategoryListApi: builder.query({
      query: (params) =>
        `/category-lists?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["categoryList"],
    }),

    getCategoryListIdApi: builder.query({
      query: (id) => `/category-list/${id}/`,
      providesTags: ["categoryList"],
    }),

    putCategoryListStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/category-list/archived-category-list/${id}`,
        method: "PUT",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["categoryList"],
    }),

    postCategoryListApi: builder.mutation({
      query: (data) => ({
        url: `/category-list`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categoryList"],
    }),

    updateCategoryListApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/category-list/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["categoryList"],
    }),

    updateMinorCategoryListApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `category-list/add-update-minorcategory/${id}`,
        method: "PUT",
        body: {
          minor_category: data.minor_category_id,
        },
      }),
      invalidatesTags: ["categoryList"],
    }),
  }),
});

export const {
  useGetCategoryListApiQuery,
  useGetCategoryListIdApiQuery,
  usePutCategoryListStatusApiMutation,
  usePostCategoryListApiMutation,
  useUpdateCategoryListApiMutation,
  useUpdateMinorCategoryListApiMutation,
} = categoryListApi;
