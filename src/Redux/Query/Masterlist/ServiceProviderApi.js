import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const serviceProviderApi = createApi({
  reducerPath: "serviceProviderApi",
  tagTypes: ["ServiceProvider"],

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
    getServiceProvidersApi: builder.query({
      query: (params) =>
        `/service-providers?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
      providesTags: ["ServiceProvider"],
    }),

    getServiceProviderAllApi: builder.query({
      query: (id) => `/service-provider?pagination=none`,
    }),

    getServiceProviderApi: builder.query({
      query: (id) => `/service-provider/${id}`,
    }),

    postServiceProviderStatusApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/service-provider/archived-service-provider/${id}`,
        method: "PUT",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["ServiceProvider"],
    }),

    postServiceProviderApi: builder.mutation({
      query: (data) => ({
        url: `/service-provider`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ServiceProvider"],
    }),

    updateServiceProviderApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/service-provider/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ServiceProvider"],
    }),
  }),
});

export const {
  useGetServiceProvidersApiQuery,
  useGetServiceProviderApiQuery,
  useGetServiceProviderAllApiQuery,
  usePostServiceProviderStatusApiMutation,
  usePostServiceProviderApiMutation,
  useUpdateServiceProviderApiMutation,
} = serviceProviderApi;
