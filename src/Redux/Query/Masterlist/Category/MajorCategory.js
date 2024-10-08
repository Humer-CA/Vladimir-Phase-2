// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const majorCategoryApi = createApi({
//   reducerPath: "majorCategoryApi",
//   tagTypes: ["majorCategory"],

//   baseQuery: fetchBaseQuery({
//     baseUrl: process.env.VLADIMIR_BASE_URL,

//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem("token");

//       headers.set("Authorization", `Bearer ${token}`);
//       headers.set("Accept", `application/json`);

//       return headers;
//     },
//   }),

//   endpoints: (builder) => ({
//     getMajorCategoryApi: builder.query({
//       query: (params) =>
//         `/major-category?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
//       providesTags: ["majorCategory"],
//     }),

//     getMajorCategoryAllApi: builder.query({
//       query: () => `/major-category?pagination=none`,
//       // transformResponse: (response) => response.data,
//       providesTags: ["majorCategory"],
//     }),

//     getMajorCategoryIdApi: builder.query({
//       query: (id) => `/major-category/${id}`,
//       providesTags: ["majorCategory"],
//     }),

//     putMajorCategoryStatusApi: builder.mutation({
//       query: ({ id, status }) => ({
//         url: `/major-category/archived-major-category/${id}`,
//         method: "PUT",
//         body: {
//           status: status,
//         },
//       }),
//       invalidatesTags: ["majorCategory"],
//     }),

//     postMajorCategoryApi: builder.mutation({
//       query: (data) => ({
//         url: `/major-category`,
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["majorCategory"],
//     }),

//     updateMajorCategoryApi: builder.mutation({
//       query: ({ id, ...data }) => ({
//         url: `/major-category/${id}`,
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: ["majorCategory"],
//     }),
//   }),
// });

// export const {
//   useGetMajorCategoryApiQuery,
//   useGetMajorCategoryAllApiQuery,
//   useLazyGetMajorCategoryAllApiQuery,
//   useGetMajorCategoryIdApiQuery,
//   usePutMajorCategoryStatusApiMutation,
//   usePostMajorCategoryApiMutation,
//   useUpdateMajorCategoryApiMutation,
// } = majorCategoryApi;

import { masterlistApi } from "../Masterlist";

const apiTags = (result, error) => (error ? [] : ["masterlistApi"]);

export const majorCategoryApi = masterlistApi
  .enhanceEndpoints({
    addTagTypes: ["majorCategory"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getMajorCategoryApi: builder.query({
        query: (params) =>
          `/major-category?search=${params.search}&page=${params.page}&per_page=${params.per_page}&status=${params.status}`,
        providesTags: apiTags,
      }),
      getMajorCategoryAllApi: builder.query({
        query: () => `/major-category?pagination=none`,
        providesTags: apiTags,
      }),
      getMajorCategoryIdApi: builder.query({
        query: (id) => `/major-category/${id}`,
        providesTags: apiTags,
      }),
      putMajorCategoryStatusApi: builder.mutation({
        query: ({ id, status }) => ({
          url: `/major-category/archived-major-category/${id}`,
          method: "PUT",
          body: { status },
        }),
        invalidatesTags: ["majorCategory"], // Invalidate on mutation
      }),
      postMajorCategoryApi: builder.mutation({
        query: (data) => ({
          url: `/major-category`,
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["majorCategory"],
      }),
      updateMajorCategoryApi: builder.mutation({
        query: ({ id, ...data }) => ({
          url: `/major-category/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["majorCategory"],
      }),
    }),
    overrideExisting: false,
  });

// Export hooks for the queries and mutations
export const {
  useGetMajorCategoryApiQuery,
  useGetMajorCategoryAllApiQuery,
  useLazyGetMajorCategoryAllApiQuery,
  useGetMajorCategoryIdApiQuery,
  usePutMajorCategoryStatusApiMutation,
  usePostMajorCategoryApiMutation,
  useUpdateMajorCategoryApiMutation,
} = majorCategoryApi;
