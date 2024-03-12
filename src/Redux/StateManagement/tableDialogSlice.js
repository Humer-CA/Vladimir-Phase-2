import { createSlice } from '@reduxjs/toolkit'

export const tableDialogSlice = createSlice({
    name: 'tableDialog',
    initialState: false,

    reducers: {
        openTableModal: (state, action) => {
            return true;

        },
        closeTableModal: (state) => {
            return false;
        },
    }
})

export const { openTableModal, closeTableModal } = tableDialogSlice.actions
export default tableDialogSlice.reducer