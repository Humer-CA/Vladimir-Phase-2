import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const requestContainerApi = createApi({
  reducerPath: "requestContainerApi",
  tagTypes: ["RequestContainer"],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VLADIMIR_BASE_URL,

    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("token");
      // console.log(endpoint);

      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", `application/json`);

      if (endpoint === "postRequestContainerApi") {
        headers.set("Accept", "application/vnd.api+json");
        headers.set("Content-Type", "multipart/form-data; charset=utf-8;");
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getRequestContainerAllApi: builder.query({
      query: (params) => ({
        url: `/request-container?per_page=${params.per_page}&page=${params.page}`,
        // url: `/request-container?pagination=none`,
        method: "GET",
      }),
      // transformResponse: (response) => response.data,
      providesTags: ["RequestContainer"],
    }),

    postRequestContainerApi: builder.mutation({
      query: (data) => ({
        url: `/request-container`,
        method: "POST",
        body: data,
        formData: true,
      }),

      // invalidatesTags: ["RequestContainer"],
    }),

    updateRequestContainerApi: builder.mutation({
      query: (data) => ({
        url: `/request-container`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RequestContainer"],
    }),

    deleteRequestContainerApi: builder.mutation({
      query: (id) => ({
        url: `/remove-container-item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RequestContainer"],
    }),

    deleteRequestContainerAllApi: builder.mutation({
      query: (data) => ({
        url: `/remove-container-item/`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["RequestContainer"],
    }),
  }),
});

export const {
  useGetRequestContainerAllApiQuery,
  usePostRequestContainerApiMutation,
  useUpdateRequestContainerApiMutation,
  useDeleteRequestContainerApiMutation,
  useDeleteRequestContainerAllApiMutation,
} = requestContainerApi;
