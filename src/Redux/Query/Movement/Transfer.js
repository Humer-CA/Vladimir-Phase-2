import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

export const transferApi = createApi({
  reducerPath: "transferApi",
  tagTypes: ["Transfer"],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VLADIMIR_BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      headers.set(`Authentication`, `Bearer ${token}`);
      headers.set("Accept", `application/json`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getApprovalApi: builder.query({
      query: (params) => `asset-transfer`,
      providesTags: ["Transfer"],
    }),
  }),
});

export const { useGetApprovalApi } = transferApi;
