import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subCapexApi = createApi({
  reducerPath: "subCapexApi",
  tagTypes: ["subCapex"],

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
    getSubCapexApi: builder.query({
      query: (params) =>
        `sub-capex?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["subCapex"],
    }),

    getSubCapexAllApi: builder.query({
      query: () => `sub-capex?status=active`,
      transformResponse: (response) => response.data,
      providesTags: ["subCapex"],
    }),

    getSubCapexIdApi: builder.query({
      query: (id) => `sub-capex/${id}`,
    }),

    postSubCapexApi: builder.mutation({
      query: (data) => ({
        url: `/sub-capex`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subCapex"],
    }),

    updateSubCapexApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/sub-capex/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["subCapex"],
    }),
  }),
});

export const {
  useGetSubCapexApiQuery,
  useGetSubCapexAllApiQuery,
  useGetSubCapexIdApiQuery,
  usePostSubCapexApiMutation,
  useUpdateSubCapexApiMutation,
} = subCapexApi;
