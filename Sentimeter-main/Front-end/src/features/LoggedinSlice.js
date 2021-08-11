import { createSlice } from "@reduxjs/toolkit";
import { JWTCookie } from "../app/cookie";

const initialState = { status: false, token: "" };
const jwt = new JWTCookie();
if (jwt.get()) {
  initialState.status = true;
  initialState.token = jwt.get();
}

export const LoggedinSlice = createSlice({
  name: "Logged in",
  initialState: initialState,
  reducers: {
    setLoggedin: (state, action) => (state = action.payload),
  },
});

export const { setLoggedin } = LoggedinSlice.actions;

export default LoggedinSlice.reducer;
