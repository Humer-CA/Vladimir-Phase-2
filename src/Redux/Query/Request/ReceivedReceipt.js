import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const receivedReceiptApi = createApi({
  reducerPath: "receivedReceiptApi",
  tagTypes: ["ReceivedReceipt"],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VLADIMIR_BASE_URL,

    prepareHeaders: (headers, { endpoint }) => {
      let token;

      if (endpoint === "cancelRrVladimirApi") {
        token = localStorage.getItem("token"); // Vladimir API token
        headers.set("Authorization", `Bearer ${token}`);
      } else if (endpoint === "cancelRrYmirApi") {
        token = "1727|hIvNQ4Md3Azge9ck7gynJBhtDUbUGOyHuYTGXFZn"; // Ymir API token
        headers.set("Authorization", `Bearer ${token}`);
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
        // body: data,
      }),
      invalidatesTags: ["ReceivedReceipt"],
    }),

    cancelRrYmirApi: builder.mutation({
      query: (params) => ({
        url: `http://10.10.13.6:8080/api/cancel_rr/${params.rr_number}`,
        method: "PATCH",
      }),
      invalidatesTags: ["ReceivedReceipt"],
    }),
  }),
});

export const { useCancelRrVladimirApiMutation, useCancelRrYmirApiMutation } = receivedReceiptApi;
