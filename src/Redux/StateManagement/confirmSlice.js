import { createSlice } from '@reduxjs/toolkit'

export const confirmSlice = createSlice({
    name: 'confirm',
    initialState: {
        open: false,
        icon: null,
        // iconColor: "#ffa000",
        iconColor: null,
        iconProps: null,
        message: 'Are you sure you want to',
        loading: false,
        onConfirm: () => { },
        autoClose: false,
        remarks: false
    },

    reducers: {
        openConfirm: (state, action) => {
            state.open = true;
            state.icon = action.payload.icon;
            state.iconColor = action.payload.iconColor;
            state.iconProps = action.payload.iconProps;
            state.message = action.payload.message;
            state.onConfirm = action.payload.onConfirm;
            state.autoClose = action.payload.autoClose || false;
            state.remarks = action.payload.remarks || "";
        },

        closeConfirm: (state) => {
            state.onConfirm = () => { };
            state.open = false;
            state.loading = false;
        },

        onLoading: (state) => {
            state.loading = true;
        },


    }
})

export const { openConfirm, closeConfirm, onLoading } = confirmSlice.actions
export default confirmSlice.reducer