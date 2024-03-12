import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const depreciationStatusApi = createApi({
  reducerPath: "depreciationStatusApi",
  tagTypes: ["DepreciationStatus"],

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
    getDepreciationStatusApi: builder.query({
      query: (params) =>
        `depreciation-status?=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["DepreciationStatus"],
    }),

    getDepreciationStatusAllApi: builder.query({
      query: () => `depreciation-status?pagination=none`,
      transformResponse: (response) => response,
      providesTags: ["DepreciationStatus"],
    }),

    getDepreciationStatusIdApi: builder.query({
      query: (id) => `depreciation-status/${id}`,
    }),

    patchDepreciationStatusStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/depreciation-status/archived-depreciation-status/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["DepreciationStatus"],
    }),

    postDepreciationStatusApi: builder.mutation({
      query: (data) => ({
        url: `/depreciation-status`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DepreciationStatus"],
    }),

    updateDepreciationStatusApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/depreciation-status/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["DepreciationStatus"],
    }),
  }),
});

export const {
  useGetDepreciationStatusApiQuery,
  useGetDepreciationStatusAllApiQuery,
  useGetDepreciationStatusIdApiQuery,
  usePatchDepreciationStatusStatusApiMutation,
  usePostDepreciationStatusApiMutation,
  useUpdateDepreciationStatusApiMutation,
} = depreciationStatusApi;
