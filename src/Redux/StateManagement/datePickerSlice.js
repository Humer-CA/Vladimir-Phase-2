import { createSlice } from '@reduxjs/toolkit'

export const datePickerSlice = createSlice({
    name: 'datePicker',
    initialState: false,

    reducers: {
        openDatePicker: (state, action) => {
            return true;

        },
        closeDatePicker: (state) => {
            return false;
        },
    }
})

export const { openDatePicker, closeDatePicker } = datePickerSlice.actions
export default datePickerSlice.reducer