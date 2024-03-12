import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const divisionApi = createApi({
  reducerPath: "divisionApi",
  tagTypes: ["Division"],

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
    getDivisionApi: builder.query({
      query: (params) =>
        `division?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["Division"],
    }),

    getDivisionAllApi: builder.query({
      query: () => `division?pagination=none`,
      transformResponse: (response) => response.data,
      providesTags: ["Division"],
    }),

    getDivisionIdApi: builder.query({
      query: (id) => `setup/getById/${id}`,
    }),

    postDivisionStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/division/archived-division/${id}`,
        method: "PUT",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["Division"],
    }),

    postDivisionApi: builder.mutation({
      query: (data) => ({
        url: `/division`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Division"],
    }),

    updateDivisionApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/division/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Division"],
    }),
  }),
});

export const {
  useGetDivisionApiQuery,
  useGetDivisionAllApiQuery,
  useGetDivisionIdApiQuery,
  usePostDivisionStatusApiMutation,
  usePostDivisionApiMutation,
  useUpdateDivisionApiMutation,
} = divisionApi;
