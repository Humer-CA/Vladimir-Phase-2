import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userAccountsApi = createApi({
  reducerPath: "userAccountsApi",
  tagTypes: ["User"],

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
    getUserAccountsApi: builder.query({
      query: (params) =>
        `user?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["User"],
    }),

    getUserAccountAllApi: builder.query({
      query: () => `/user?pagination=none`,
    }),

    getUserAccountApi: builder.query({
      query: (id) => `/user/getuserbyid?id=${id}`,
      transformResponse: (response, meta, arg) => response.user,
    }),

    postUserStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/user/archived-user/${id}`,
        method: "PUT",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["User"],
    }),

    postUserApi: builder.mutation({
      query: (data) => ({
        url: `/user`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    updateUserApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    resetUserApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/auth/reset/${id}`,
        method: "PUT",
        body: {
          id: id,
        },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserAccountsApiQuery,
  useGetUserAccountAllApiQuery,
  useLazyGetUserAccountAllApiQuery,
  useGetUserAccountApiQuery,
  usePostUserStatusApiMutation,
  usePostUserApiMutation,
  useUpdateUserApiMutation,
  useResetUserApiMutation,
} = userAccountsApi;
