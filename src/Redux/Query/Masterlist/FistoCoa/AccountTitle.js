import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const accountTitleApi = createApi({
  reducerPath: "accountTitleApi",
  tagTypes: ["AccountTitle"],

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
    getAccountTitleApi: builder.query({
      query: (params) =>
        `/account-title?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["AccountTitle"],
    }),

    getAccountTitleAllApi: builder.query({
      query: () => `/account-title?pagination=none`,
    }),

    postAccountTitleApi: builder.mutation({
      query: (data) => ({
        url: `/account-title`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AccountTitle"],
    }),

    patchAccountTitleStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/account-title/archived-account-title/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["AccountTitle"],
    }),
  }),
});

export const {
  useGetAccountTitleApiQuery,
  useGetAccountTitleAllApiQuery,
  usePostAccountTitleApiMutation,
  usePatchAccountTitleStatusApiMutation,
} = accountTitleApi;
