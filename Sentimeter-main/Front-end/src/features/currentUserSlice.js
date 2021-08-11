import { createSlice } from "@reduxjs/toolkit";
import { UserCookie } from "../app/cookie";

let initialState = { username: "", firstname: "", lastname: "", email: "", image: "" };
const userCookie = new UserCookie();
if (userCookie.get()) {
  const user = userCookie.get();
  initialState = { username: user.username, firstname: user.firstname, lastname: user.lastname, email: user.email, image: user.image };
}

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: initialState,
  reducers: {
    setCurrentUser: (state, action) => (state = action.payload),
  },
});

export const { setCurrentUser } = currentUserSlice.actions;

export default currentUserSlice.reducer;
