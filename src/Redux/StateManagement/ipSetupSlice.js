import { createSlice } from '@reduxjs/toolkit'

export const ipSetupSlice = createSlice({
    name: 'ipSetup',
    initialState: false,


    reducers: {
        openIpSetupDialog: (state, action) => {
            return true;

        },
        closeIpSetupDialog: (state) => {
            return false;
        },
    }

})

export const { openIpSetupDialog, closeIpSetupDialog } = ipSetupSlice.actions
export default ipSetupSlice.reducer