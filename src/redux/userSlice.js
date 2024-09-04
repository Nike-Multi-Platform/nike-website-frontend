import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
  // Add more state properties here
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {},
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
