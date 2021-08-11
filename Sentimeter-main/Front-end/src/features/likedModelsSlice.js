import { createSlice } from "@reduxjs/toolkit";

export const likedModelsSlice = createSlice({
  name: "likedModels",
  initialState: 0,
  reducers: {
    setLikedModels: (state, action) => (state = action.payload),
  },
});

export const { setLikedModels } = likedModelsSlice.actions;

export default likedModelsSlice.reducer;
