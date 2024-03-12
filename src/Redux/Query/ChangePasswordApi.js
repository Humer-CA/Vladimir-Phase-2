import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const changePasswordApi = createApi({
    reducerPath: 'changePasswordApi',
    tagTypes: ["ChangePassword"],


    baseQuery: fetchBaseQuery({
        baseUrl: process.env.VLADIMIR_BASE_URL,

        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')

            headers.set('Authorization', `Bearer ${token}`)
            headers.set('Accept', `application/json`)

            return headers
        }
    }),

    endpoints: (builder) => ({
        getChangePasswordApi: builder.query({
            query: (id) => `/auth/change_password/`,
        }),

        postChangePasswordApi: builder.mutation({
            query: (data) => ({
                url: `/auth/change_password`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["ChangePassword"]
        }),

    }),
})

export const { useGetChangePasswordApiQuery, usePostChangePasswordApiMutation } = changePasswordApi