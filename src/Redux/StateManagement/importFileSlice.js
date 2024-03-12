import { createSlice } from '@reduxjs/toolkit'

export const importFileSlice = createSlice({
    name: 'importFile',
    initialState: false,

    reducers: {
        openImport: (state, action) => {
            return true;

        },
        closeImport: (state) => {
            return false;
        },
    }
})

export const { openImport, closeImport } = importFileSlice.actions
export default importFileSlice.reducer