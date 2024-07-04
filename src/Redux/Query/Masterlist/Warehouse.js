import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const warehouseApi = createApi({
  reducerPath: "warehouseApi",
  tagTypes: ["Warehouse"],

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
    getWarehouseApi: builder.query({
      query: (params) =>
        `warehouse?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["Warehouse"],
    }),

    getWarehouseAllApi: builder.query({
      query: () => `warehouse?pagination=none&status=active`,
      providesTags: ["Warehouse"],
    }),

    getWarehouseIdApi: builder.query({
      query: (id) => `setup/getById/${id}`,
    }),

    postWarehouseStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/warehouse/archived-warehouse/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["Warehouse"],
    }),

    postWarehouseApi: builder.mutation({
      query: (data) => ({
        url: `/warehouse`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Warehouse"],
    }),

    updateWarehouseApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/warehouse/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Warehouse"],
    }),
  }),
});

export const {
  useGetWarehouseApiQuery,
  useGetWarehouseAllApiQuery,
  useLazyGetWarehouseAllApiQuery,
  useGetWarehouseIdApiQuery,
  usePostWarehouseStatusApiMutation,
  usePostWarehouseApiMutation,
  useUpdateWarehouseApiMutation,
} = warehouseApi;
