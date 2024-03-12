import { createSlice } from '@reduxjs/toolkit'

export const scanFileSlice = createSlice({
    name: 'scanFile',
    initialState: false,

    reducers: {
        openScan: (state, action) => {
            return true;

        },
        closeScan: (state) => {
            return false;
        },
    }
})

export const { openScan, closeScan } = scanFileSlice.actions
export default scanFileSlice.reducer