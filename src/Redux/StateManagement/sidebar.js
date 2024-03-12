import { createSlice } from '@reduxjs/toolkit'

export const sidebarSlice = createSlice({
    name: 'sideBarCollapse',
    initialState: {
        open: false,
    },
    reducers: {
        openSidebar: (state) => {
            state.open = true;
        },
        closeSidebar: (state) => {
            state.open = false;
        },
        toggleSidebar: (state) => {
            state.open = !state.open;
        },
    }

})

export const { openSidebar, closeSidebar, toggleSidebar } = sidebarSlice.actions
export default sidebarSlice.reducer