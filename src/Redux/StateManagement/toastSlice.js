import { createSlice } from '@reduxjs/toolkit'

export const toastSlice = createSlice({
    name: 'toast',
    initialState: {
        open: false,
        variant: 'success',
        message: '',
        duration: 5000,
    },
    reducers: {
        openToast: (state, action) => {
            // console.log(action)
            state.open = true;
            state.variant = action.payload.variant || "success";
            state.message = action.payload.message;
            state.duration= action.payload.duration;
        },
        closeToast: (state) => {
            state.open = false;
            // state.variant = "success";
            // state.message = '';
            state.duration= 5000;
        },
    }

})

export const { openToast, closeToast } = toastSlice.actions
export default toastSlice.reducer