import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const vladimirAPI = createApi({
    reducerPath: 'vladimirAPI',
    baseQuery: fetchBaseQuery({
        // baseUrl: "http://127.0.0.1:8000/api"
        baseUrl: process.env.VLADIMIR_BASE_URL,
    }),

    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => `UserAccounts/`,

        }),
    }),
})

export const { useGetUsersQuery, useGetUserQuery } = vladimirAPI