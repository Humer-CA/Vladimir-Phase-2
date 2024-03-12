import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roleManagementApi = createApi({
  reducerPath: "roleManagementApi",
  tagTypes: ["Role"],

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
    getRoleApi: builder.query({
      query: (params) =>
        `role-management?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["Role"],
    }),

    getRoleAllApi: builder.query({
      query: (params) => `/role-management?pagination=none`,
      providesTags: ["Role"],
    }),

    getRoleIdApi: builder.query({
      query: (id) => `role-management/${id}`,
    }),

    postRoleStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/role-management/archived-role-management/${id}`,
        method: "PUT",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["Role"],
    }),

    postRoleApi: builder.mutation({
      query: (data) => ({
        url: `/role-management`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    updateRoleApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/role-management/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  useGetRoleApiQuery,
  useGetRoleAllApiQuery,
  useGetRoleIdApiQuery,
  usePostRoleStatusApiMutation,
  usePostRoleApiMutation,
  useUpdateRoleApiMutation,
} = roleManagementApi;
