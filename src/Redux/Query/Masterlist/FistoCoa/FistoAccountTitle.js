import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const fistoAccountTitleApi = createApi({
    reducerPath: 'fistoAccountTitleApi',

    baseQuery: fetchBaseQuery({
        baseUrl: "http://10.10.2.76:8000/api",
        prepareHeaders: (headers) => {
            const token = process.env.FISTO_KEY

            headers.set('Authorization', `Bearer ${token}`)
            headers.set('Accept', `application/json`)

            return headers
        }
    }),

    endpoints: (builder) => ({

        getFistoAccountTitleAllApi: builder.query({
            query: () => `/dropdown/account-title?status=all&paginate=0&api_for=vladimir`,
        }),

    }),
})


export const { useGetFistoAccountTitleAllApiQuery, useLazyGetFistoAccountTitleAllApiQuery } = fistoAccountTitleApi
