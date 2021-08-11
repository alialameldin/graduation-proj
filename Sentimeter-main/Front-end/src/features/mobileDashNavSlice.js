import { createSlice } from "@reduxjs/toolkit";

export const mobileDashNavSlice = createSlice({
  name: "mobile dashboard navbar",
  initialState: false,
  reducers: {
    setMobileDashNavOpen: (state, action) => (state = action.payload),
  },
});

export const { setMobileDashNavOpen } = mobileDashNavSlice.actions;

export default mobileDashNavSlice.reducer;
