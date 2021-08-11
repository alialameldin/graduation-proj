import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedin } from "../../../features/LoggedinSlice";
import { setCurrentUser } from "../../../features/currentUserSlice";
import { JWTCookie, UserCookie } from "../../../app/cookie";

const Logout = (props) => {
  const history = useHistory();
  const loginDispatch = useDispatch(setLoggedin);
  const currentUserDispatch = useDispatch(setCurrentUser);
  const { loggedin } = useSelector((state) => state);
  useEffect(() => {
    if (loggedin.status) {
      currentUserDispatch(setCurrentUser({ username: "", firstname: "", lastname: "", email: "" }));
      loginDispatch(setLoggedin({ status: false, token: "" }));
      const jwt = new JWTCookie();
      const user = new UserCookie();
      jwt.remove();
      user.remove();
    }
    history.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div></div>;
};

export default Logout;
