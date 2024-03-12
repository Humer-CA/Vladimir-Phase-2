import { createSlice } from '@reduxjs/toolkit'

export const changePasswordSlice = createSlice({
    name: 'changePassword',
    initialState: false,


    reducers: {
        openChangePassword: () => {
            return true;

        },
        closeChangePassword: () => {
            return false;
        },
    }

})

export const { openChangePassword, closeChangePassword } = changePasswordSlice.actions
export default changePasswordSlice.reducer