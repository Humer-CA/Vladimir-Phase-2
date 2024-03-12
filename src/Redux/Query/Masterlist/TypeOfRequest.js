import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const typeOfRequestApi = createApi({
  reducerPath: "typeOfRequestApi",
  tagTypes: ["TypeOfRequest"],

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
    getTypeOfRequestApi: builder.query({
      query: (params) =>
        `type-of-request?search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["TypeOfRequest"],
    }),

    getTypeOfRequestAllApi: builder.query({
      query: () => `type-of-request?pagination=none`,
      transformResponse: (response) => response,
      providesTags: ["TypeOfRequest"],
    }),

    getTypeOfRequestIdApi: builder.query({
      query: (id) => `type-of-request/${id}`,
    }),

    postTypeOfRequestStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/type-of-request/archived-tor/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["TypeOfRequest"],
    }),

    postTypeOfRequestApi: builder.mutation({
      query: (data) => ({
        url: `/type-of-request`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TypeOfRequest"],
    }),

    updateTypeOfRequestApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/type-of-request/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["TypeOfRequest"],
    }),
  }),
});

export const {
  useGetTypeOfRequestApiQuery,
  useGetTypeOfRequestAllApiQuery,
  useGetTypeOfRequestIdApiQuery,
  usePostTypeOfRequestStatusApiMutation,
  usePostTypeOfRequestApiMutation,
  useUpdateTypeOfRequestApiMutation,
} = typeOfRequestApi;
