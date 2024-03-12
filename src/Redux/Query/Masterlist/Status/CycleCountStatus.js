import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cycleCountStatusApi = createApi({
  reducerPath: "cycleCountStatusApi",
  tagTypes: ["CycleCountStatus"],

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
    getCycleCountStatusApi: builder.query({
      query: (params) =>
        `cycle-count-status?=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["CycleCountStatus"],
    }),

    getCycleCountStatusAllApi: builder.query({
      query: () => `cycle-count-status?pagination=none`,
      transformResponse: (response) => response,
      providesTags: ["CycleCountStatus"],
    }),

    getCycleCountStatusIdApi: builder.query({
      query: (id) => `cycle-count-status/${id}`,
    }),

    patchCycleCountStatusStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/cycle-count-status/archived-cycle-count-status/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["CycleCountStatus"],
    }),

    postCycleCountStatusApi: builder.mutation({
      query: (data) => ({
        url: `/cycle-count-status`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CycleCountStatus"],
    }),

    updateCycleCountStatusApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/cycle-count-status/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CycleCountStatus"],
    }),
  }),
});

export const {
  useGetCycleCountStatusApiQuery,
  useGetCycleCountStatusAllApiQuery,
  useGetCycleCountStatusIdApiQuery,
  usePatchCycleCountStatusStatusApiMutation,
  usePostCycleCountStatusApiMutation,
  useUpdateCycleCountStatusApiMutation,
} = cycleCountStatusApi;
