import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const requisitionSmsApi = createApi({
  reducerPath: "requisitionSmsApi",
  tagTypes: ["RequisitionSms"],

  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.10.15:80/api",

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", `application/json`);
      return headers;
    },
  }),

  endpoints: (builder) => ({
    postRequisitionSmsApi: builder.mutation({
      query: ({ system_name, message, mobile_number }) => ({
        url: `/post_message`,
        method: "POST",
        body: { system_name, message, mobile_number },
      }),
      invalidatesTags: ["RequisitionSms"],
    }),
  }),
});

export const { usePostRequisitionSmsApiMutation } = requisitionSmsApi;
