import { createSlice } from "@reduxjs/toolkit";

export const paginationSlice = createSlice({
  name: "pagination",
  initialState: 5,

  reducers: {
    savePage: (state) => {
      return false;
    },
  },
});

export const { savePage } = paginationSlice.actions;
export default paginationSlice.reducer;
