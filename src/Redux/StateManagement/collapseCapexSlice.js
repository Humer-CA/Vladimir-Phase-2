import { createSlice } from '@reduxjs/toolkit'

export const collapseCapexSlice = createSlice({
    name: 'collapseCapex',
    initialState: null,


    reducers: {
        openCollapse: (state, action) => {
            if (state === action.payload) {
                return null;
            }
            return action.payload;
        },

    }

})

export const { openCollapse } = collapseCapexSlice.actions
export default collapseCapexSlice.reducer