import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ymirPrApi = createApi({
  reducerPath: "ymirPrApi",
  tagTypes: ["YmirPr"],

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
    getYmirPrApi: builder.query({
      query: (params) =>
        // `/ymir/pr-request?transaction_number=${params.transaction_number}&page=${params.page}&per_page=${params.per_page}`,
        `/ymir/pr-request?pagination=none&transaction_number=${params.transaction_number}`,
      providesTags: ["YmirPr"],
    }),
  }),
});

export const { useGetYmirPrApiQuery } = ymirPrApi;
