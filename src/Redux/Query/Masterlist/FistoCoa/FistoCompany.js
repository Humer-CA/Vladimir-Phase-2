import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const fistoCompanyApi = createApi({
    reducerPath: 'fistoCompanyApi',

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

        getFistoCompanyAllApi: builder.query({
            query: () => `/dropdown/company?status=all&paginate=0&api_for=vladimir`,
        }),

    }),
})


export const { useGetFistoCompanyAllApiQuery, useLazyGetFistoCompanyAllApiQuery } = fistoCompanyApi
