import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const fistoDepartmentApi = createApi({
    reducerPath: 'fistoDepartmentApi',

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

        getFistoDepartmentAllApi: builder.query({
            query: () => `/dropdown/department?status=all&paginate=0&api_for=vladimir`,
        }),

    }),
})


export const { useGetFistoDepartmentAllApiQuery, useLazyGetFistoDepartmentAllApiQuery } = fistoDepartmentApi
