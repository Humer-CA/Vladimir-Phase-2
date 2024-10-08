import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const masterlistApi = createApi({
  reducerPath: "masterlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VLADIMIR_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["masterlistApi"], // Define any tags you need for caching
  endpoints: () => ({}), // Start with empty endpoints
});
