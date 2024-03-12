import { createSlice } from '@reduxjs/toolkit'

export const dialogSlice = createSlice({
    name: 'dialog',
    initialState: false,


    reducers: {
        openDialog: (state, action) => {
            return true;

        },
        closeDialog: (state) => {
            return false;
        },
    }

})

export const { openDialog, closeDialog } = dialogSlice.actions
export default dialogSlice.reducer