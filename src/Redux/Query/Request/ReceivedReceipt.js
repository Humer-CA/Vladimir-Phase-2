import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const receivedReceiptApi = createApi({
  reducerPath: "receivedReceiptApi",
  tagTypes: ["ReceivedReceipt"],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VLADIMIR_BASE_URL,

    prepareHeaders: (headers, { endpoint }) => {
      if (endpoint === "cancelRrVladimirApi") {
        const token = localStorage.getItem("token"); // Vladimir API token
        headers.set("Authorization", `Bearer ${token}`);
      } else if (endpoint === "cancelRrYmirApi") {
        const ymirToken = process.env.YMIR_KEY; // Ymir API token
        headers.set("Token", `Bearer ${ymirToken}`);
      }

      headers.set("Accept", "application/json");
      return headers;
    },
  }),

  endpoints: (builder) => ({
    cancelRrVladimirApi: builder.mutation({
      query: (params) => ({
        url: `/cancel-rr/${params.rr_number}`,
        method: "PATCH",
        body: params,
      }),
      invalidatesTags: ["ReceivedReceipt"],
    }),

    cancelRrYmirApi: builder.mutation({
      query: (params) => ({
        url: `${process.env.YMIR_BASE_URL}/cancel_rr/${params.rr_number}`,
        method: "PATCH",
        body: params,
      }),
      invalidatesTags: ["ReceivedReceipt"],
    }),
  }),
});

export const { useCancelRrVladimirApiMutation, useCancelRrYmirApiMutation } = receivedReceiptApi;
