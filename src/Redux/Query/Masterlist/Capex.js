import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const capexApi = createApi({
  reducerPath: "capexApi",
  tagTypes: ["Capex"],

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
    getCapexApi: builder.query({
      query: (params) =>
        `capex?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["Capex"],
    }),

    getCapexAllApi: builder.query({
      query: () => `capex?pagination=none`,
      // transformResponse: (response) => response.data,
      providesTags: ["Capex"],
    }),

    getCapexIdApi: builder.query({
      query: (id) => `capex/${id}`,
    }),

    patchCapexStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/capex/archived-capex/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["Capex"],
    }),

    postCapexApi: builder.mutation({
      query: (data) => ({
        url: `/capex`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Capex"],
    }),

    updateCapexApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/capex/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Capex"],
    }),

    postImportApi: builder.mutation({
      query: (data) => ({
        url: `/import-capex`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Capex"],
    }),

    postSubCapexApi: builder.mutation({
      query: (data) => ({
        url: `/sub-capex`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Capex"],
    }),

    updateSubCapexApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/sub-capex/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Capex"],
    }),

    patchSubCapexStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/sub-capex/archived-sub-capex/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["Capex"],
    }),

    getExportApi: builder.query({
      query: () => ({
        url: `/capex-export`,
      }),
    }),
  }),
});

export const {
  useGetCapexApiQuery,
  useGetCapexAllApiQuery,
  useLazyGetCapexAllApiQuery,
  useGetCapexIdApiQuery,
  usePatchCapexStatusApiMutation,
  usePostCapexApiMutation,
  useUpdateCapexApiMutation,
  usePostImportApiMutation,
  usePostSubCapexApiMutation,
  useUpdateSubCapexApiMutation,
  usePatchSubCapexStatusApiMutation,
  useLazyGetExportApiQuery,
} = capexApi;
