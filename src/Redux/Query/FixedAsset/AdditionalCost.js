import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const additionalCostApi = createApi({
  reducerPath: "additionalCost",
  tagTypes: ["AdditionalCost"],

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
    getAdditionalCostAllApi: builder.query({
      query: () => `additional-cost?pagination=none`,
    }),

    getAdditionalCostIdApi: builder.query({
      query: (id) => `additional-cost/${id}`,
      providesTags: ["AdditionalCost"],
    }),

    postAdditionalCostApi: builder.mutation({
      query: (data) => ({
        url: `/additional-cost`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdditionalCost"],
    }),

    updateAdditionalCostApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/additional-cost/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["AdditionalCost"],
    }),

    archiveAdditionalCostApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/add-cost/archived-add-cost/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdditionalCost"],
    }),

    postCalcDepreAddCostApi: builder.mutation({
      query: (params) => ({
        url: `/add-cost-depreciation/${params.id}`,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["AdditionalCost"],
    }),

    postImportApi: builder.mutation({
      query: (data) => ({
        url: `/import-add-cost`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FixedAsset"],
    }),
  }),
});

export const {
  useGetAdditionalCostAllApiQuery,
  useGetAdditionalCostIdApiQuery,
  usePostAdditionalCostApiMutation,
  useArchiveAdditionalCostApiMutation,
  useUpdateAdditionalCostApiMutation,
  usePostCalcDepreAddCostApiMutation,
  usePostImportApiMutation,
} = additionalCostApi;
