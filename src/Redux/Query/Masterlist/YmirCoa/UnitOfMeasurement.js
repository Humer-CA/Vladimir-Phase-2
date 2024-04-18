import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const unitOfMeasurementApi = createApi({
  reducerPath: "unitOfMeasurementApi",
  tagTypes: ["UnitOfMeasurement"],

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
    getUnitOfMeasurementApi: builder.query({
      query: (params) =>
        `/uom?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["UnitOfMeasurement"],
    }),

    getUnitOfMeasurementAllApi: builder.query({
      query: () => `/uom?pagination=none`,
    }),

    postUnitOfMeasurementApi: builder.mutation({
      query: (data) => ({
        url: `/uom`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UnitOfMeasurement"],
    }),
  }),
});

export const {
  useGetUnitOfMeasurementApiQuery,
  useGetUnitOfMeasurementAllApiQuery,
  useLazyGetUnitOfMeasurementAllApiQuery,
  usePostUnitOfMeasurementApiMutation,
} = unitOfMeasurementApi;
