import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sedarUsersApi = createApi({
  reducerPath: "sedarUsersApi",
  tagTypes: ["User"],

  baseQuery: fetchBaseQuery({
    baseUrl: "https://rdfsedar.com/api",
    prepareHeaders: (headers) => {
      const token = process.env.SEDAR_KEY;

      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", `application/json`);

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getSedarUsersApi: builder.query({
      query: () => `/data/employee/filter/active`,
      transformResponse: (response) => response.data,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetSedarUsersApiQuery, useLazyGetSedarUsersApiQuery } = sedarUsersApi;
