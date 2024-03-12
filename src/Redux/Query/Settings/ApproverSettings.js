import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const approverSettingsApi = createApi({
  reducerPath: "approverSettingsApi",
  tagTypes: ["ApproverSettings"],

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
    getApproverSettingsApi: builder.query({
      query: (params) =>
        `approver-setting?search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}`,
      providesTags: ["ApproverSettings"],
    }),

    getApproverSettingsAllApi: builder.query({
      query: () => `approver-setting?pagination=none`,
      // transformResponse: (response) => response.data,
      providesTags: ["ApproverSettings"],
    }),

    // getApproverSettingsIdApi: builder.query({
    //     query: (id) => `approver-setting/${id}`,
    // }),

    postApproverSettingsStatusApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/approver-setting/archived-approver-setting/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ApproverSettings"],
    }),

    postApproverSettingsApi: builder.mutation({
      query: (data) => ({
        url: `/approver-setting`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ApproverSettings"],
    }),

    updateApproverSettingsApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/approver-setting/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ApproverSettings"],
    }),

    getApproversApi: builder.query({
      query: () => `/setup-approver`,
      // transformResponse: (response) => response.data,
      providesTags: ["ApproverSettings"],
    }),
  }),
});

export const {
  useGetApproverSettingsApiQuery,
  useGetApproverSettingsAllApiQuery,
  // useGetApproverSettingsIdApiQuery,
  usePostApproverSettingsStatusApiMutation,
  usePostApproverSettingsApiMutation,
  useUpdateApproverSettingsApiMutation,
  useGetApproversApiQuery,
} = approverSettingsApi;
