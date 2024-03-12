import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const modulesApi = createApi({
  reducerPath: "modulesApi",
  tagTypes: ["Modules"],

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
    getModulesApi: builder.query({
      query: (params) =>
        `setup/get-modules=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["Modules"],
    }),

    getModuleApi: builder.query({
      query: (id) => `setup/getById/${id}`,
    }),

    postModuleStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/setup/get-modules/archived-modules/${id}`,
        method: "PUT",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["Modules"],
    }),

    postModuleApi: builder.mutation({
      query: (data) => ({
        url: `/setup/module`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Modules"],
    }),

    updateModuleApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/setup/update-modules/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Modules"],
    }),
  }),
});

export const {
  useGetModulesApiQuery,
  useGetModuleApiQuery,
  usePostModuleStatusApiMutation,
  usePostModuleApiMutation,
  useUpdateModuleApiMutation,
} = modulesApi;
