import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "token",
  initialState: {
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user")),
  },
  reducers: {
    addUserDetails: (state, action) => {
      return {
        token: action.payload.token,
        user: action.payload.user,
      };
    },

    removeUserDetails: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { addUserDetails, removeUserDetails } = counterSlice.actions;
export default counterSlice.reducer;
