import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ipAddressSetupApi = createApi({
  reducerPath: "ipAddressSetupApi",
  tagTypes: ["Ip"],

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
    getIpAddressApi: builder.query({
      query: (params) => `/printer-ip?search=${params.search}&page=${params.page}&per_page=${params.per_page}`,
      providesTags: ["Ip"],
    }),

    getIpApi: builder.query({
      query: () => `https://vladimir.rdfmis.ph/server/api/getIP`,
      providesTags: ["Ip"],
    }),

    getIpAddressAllApi: builder.query({
      query: () => `/printer-ip`,
      transformResponse: (response) => response.data,
      providesTags: ["Ip"],
    }),

    patchIpAddressStatusApi: builder.mutation({
      query: (id) => ({
        url: `/activateIp/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Ip"],
    }),

    postIpAddressApi: builder.mutation({
      query: (data) => ({
        url: `/printer-ip`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Ip"],
    }),

    deleteIpAddressApi: builder.mutation({
      query: (id) => ({
        url: `/printer-ip/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ip"],
    }),
  }),
});

export const {
  useGetIpAddressApiQuery,
  useGetIpApiQuery,
  usePatchIpAddressStatusApiMutation,
  useGetIpAddressAllApiQuery,
  usePostIpAddressApiMutation,
  useDeleteIpAddressApiMutation,
} = ipAddressSetupApi;

export const ipAddressPretestSetupApi = createApi({
  reducerPath: "ipAddressPretestSetupApi",
  tagTypes: ["IpPretest"],

  baseQuery: fetchBaseQuery({
    baseUrl: `https://vladimir.rdfmis.ph/server/api/`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", `application/json`);

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getIpAddressPretestApi: builder.query({
      query: (params) => `/printer-ip?search=${params.search}&page=${params.page}&per_page=${params.per_page}`,
      providesTags: ["IpPretest"],
    }),
  }),
});

export const { useGetIpAddressPretestApi } = ipAddressSetupApi;
