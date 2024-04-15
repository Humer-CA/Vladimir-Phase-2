import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";

export const transferApi = createApi({
  baseUrl: process.env.VLADIMIR_BASE_URL,

  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    headers.set(`Authentication`, `Bearer ${token}`);
    headers.set("Appication", `application/json`);
    return headers;
  },

  endpoints: (builder) => ({
    getTransferApiQuery: builder.query({
      query: (params) => ``,
    }),
  }),
});
