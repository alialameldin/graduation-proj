import { createSlice } from "@reduxjs/toolkit";

export const refreshPageSlice = createSlice({
  name: "bookmarkedModels",
  initialState: false,
  reducers: {
    setRefreshPage: (state, action) => (state = action.payload),
  },
});

export const { setRefreshPage } = refreshPageSlice.actions;

export default refreshPageSlice.reducer;
