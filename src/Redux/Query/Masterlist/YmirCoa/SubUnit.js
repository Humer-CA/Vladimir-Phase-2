import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subUnitApi = createApi({
  reducerPath: "subUnitApi",
  tagTypes: ["subUnit"],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VLADIMIR_BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", "application/json");
    },
  }),

  endpoints: (builder) => ({
    getSubUnitApi: builder.query({
      query: (params) =>
        `sub-unit?search=${params.search}&status=${params.status}&per_page=${params.per_page}&page=${params.page}`,
      providesTags: ["subUnit"],
    }),

    getSubUnitAllApi: builder.query({
      query: () => `sub-unit?pagination=none`,
      providesTags: ["subUnit"],
    }),

    getSubUnitIdApi: builder.query({
      query: (id) => `sub-unit/${id}`,
      providesTags: ["subUnit"],
    }),

    postSubUnitApi: builder.mutation({
      query: (data) => ({
        url: `/sub-unit`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subUnit"],
    }),

    updateSubUnitApi: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/sub-unit/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["subUnit"],
    }),

    patchSubUnitApi: builder.mutation({
      query: ({ id, status }) => ({
        url: `/archived-sub-unit/${id}`,
        method: "PATCH",
        body: {
          status: status,
        },
      }),
      invalidatesTags: ["subUnit"],
    }),
  }),
});

export const {
  useGetSubUnitApiQuery,
  useGetSubUnitAllApiQuery,
  useGetSubUnitIdApiQuery,
  usePostSubUnitApiMutation,
  useUpdateSubUnitApiMutation,
  usePatchSubUnitApiMutation,
} = subUnitApi;
