import { createSlice } from "@reduxjs/toolkit";

export const screenSlice = createSlice({
  name: "screen",
  initialState: "Full HD",
  reducers: {
    setScreen: (state, action) => (state = action.payload),
  },
});

export const { setScreen } = screenSlice.actions;

export default screenSlice.reducer;
