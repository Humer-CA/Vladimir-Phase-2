
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const stalwartPrintingFaApi = createApi({
    reducerPath: 'printFixedAssetApi',

    baseQuery: fetchBaseQuery({
        baseUrl: `http://stalwart:8069/VladimirPrinting/public/index.php/api`,

        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')

            headers.set('Authorization', `Bearer ${token}`)
            headers.set('Accept', `application/json`)

            return headers
        }
    }),

    endpoints: (builder) => ({
        postPrintStalwartIdApi: builder.mutation({
            query: (params) => ({
                url: `fixed-asset/barcode?search=${params.search}`,
                method: "POST",
            }), invalidatesTags: ["FixedAsset"]
        }),

        postPrintStalwartDateApi: builder.mutation({
            query: (params) => ({
                url: `fixed-asset/barcode?search=${params.search}&startDate=${params.startDate}&endDate=${params.endDate}`,
                method: "POST",
            }), invalidatesTags: ["FixedAsset"]
        }),
    }),
})

export const { usePostPrintStalwartIdApiMutation, usePostPrintStalwartDateApiMutation, } = stalwartPrintingFaApi

