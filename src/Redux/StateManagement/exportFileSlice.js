import { createSlice } from '@reduxjs/toolkit'

export const exportFileSlice = createSlice({
    name: 'exportFile',
    initialState: false,

    reducers: { 
        openExport: (state, action) => {
            return true;

        },
        closeExport: (state) => {
            return false;
        },
    }
}) 

export const { openExport, closeExport } = exportFileSlice.actions
export default exportFileSlice.reducer