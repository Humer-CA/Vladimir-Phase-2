import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const requisitionApi = createApi({
  reducerPath: "requisitionApi",
  tagTypes: ["Requisition"],

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
    getRequisitionApi: builder.query({
      query: (params) =>
        `asset-request?&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}&filter=${params.filter}`,
      providesTags: ["Requisition"],
    }),

    getRequisitionPerItemApi: builder.query({
      query: (params) => `item-detail/${params.reference_number}?&per_page=${params.per_page}&page=${params.page}`,
      providesTags: ["Requisition"],
    }),

    getRequisitionMonitoringApi: builder.query({
      query: (params) =>
        `asset-request?&search=${params.search}&per_page=${params.per_page}&status=${params.status}&page=${params.page}&for_monitoring=1&filter=${params.filter}`,
      providesTags: ["Requisition"],
    }),

    getRequisitionAllApi: builder.query({
      query: () => `asset-request?pagination=none`,
      // transformResponse: (response) => response.data,
      providesTags: ["Requisition"],
    }),

    getRequisitionIdApi: builder.query({
      query: (id) => `asset-request/${id}`,
      providesTags: ["Requisition"],
    }),

    getTimelineIdApi: builder.query({
      query: (transaction_number) => `per-request/${transaction_number}`,
      providesTags: ["Requisition"],
    }),

    getByTransactionApi: builder.query({
      query: (params) => `asset-request/${params.transaction_number}`,
      transformResponse: (res) => res.data,
      providesTags: ["Requisition"],
    }),

    getByTransactionPageApi: builder.query({
      query: (params) => `asset-request/${params?.transaction_number}?per_page=${params.per_page}&page=${params.page}`,
      providesTags: ["Requisition"],
    }),

    patchRequisitionStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/asset-request/archived-tor/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["Requisition"],
    }),

    postRequisitionApi: builder.mutation({
      query: (data) => ({
        url: `/move-to-asset-request`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Requisition"],
    }),

    // postResubmitRequisitionApi: builder.mutation({
    //   query: ({ transaction_number, ...body }) => ({
    //     url: `/resubmit-request/${transaction_number}`,
    //     method: "PATCH",
    //     body,
    //   }),
    //   invalidatesTags: ["Requisition"],
    // }),
    postResubmitRequisitionApi: builder.mutation({
      query: ({ transaction_number, body }) => ({
        url: `/resubmit-request`,
        method: "PATCH",
        body: { transaction_number },
      }),
      invalidatesTags: ["Requisition"],
    }),

    // postRequisitionApi: builder.mutation({
    //   query: (data) => ({
    //     url: `/asset-request`,
    //     method: "POST",
    //     body: data,
    //   }),
    //   invalidatesTags: ["Requisition"],
    // }),

    updateRequisitionApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/asset-request/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Requisition"],
    }),

    voidRequisitionApi: builder.mutation({
      query: (body) => ({
        url: `/delete-request/${body?.transaction_number}`,
        method: "DELETE",
        body,
      }),

      invalidatesTags: ["Requisition"],
    }),

    deleteRequisitionReferenceApi: builder.mutation({
      query: (body) => ({
        url: `/delete-request/${body?.transaction_number}/${body?.reference_number}`,
        method: "DELETE",
        // body,
      }),

      invalidatesTags: ["Requisition"],
    }),
  }),
});

export const {
  useGetRequisitionApiQuery,
  useGetRequisitionPerItemApiQuery,
  useGetRequisitionMonitoringApiQuery,
  useLazyGetRequisitionMonitoringApiQuery,
  useGetRequisitionAllApiQuery,
  useLazyGetRequisitionAllApiQuery,
  useGetRequisitionIdApiQuery,
  useGetByTransactionApiQuery,
  useGetByTransactionPageApiQuery,
  usePatchRequisitionStatusApiMutation,
  usePostRequisitionApiMutation,
  usePostResubmitRequisitionApiMutation,
  useUpdateRequisitionApiMutation,
  useVoidRequisitionApiMutation,
  useDeleteRequisitionReferenceApiMutation,
} = requisitionApi;
