import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import SecondaryPageHeader from "../../../components/Homepage/SecondaryPageHeader/SecondaryPageHeader";
import SecondaryPageContainer from "../../../containers/Homepage/SecondaryPageContainer/SecondaryPageContainer";
import WhiteContainer from "../../../containers/Homepage/WhiteContainer/WhiteContainer";
import classes from "./LoginPage.module.css";
import Notification from "../../../components/Homepage/Notification/Notification";
import { setLoggedin } from "../../../features/LoggedinSlice";
import { setCurrentUser } from "../../../features/currentUserSlice";
import { useDispatch, useSelector } from "react-redux";
import FormGroup from "../../../components/Homepage/FormGroup/FormGroup";
import CustomButton from "../../../components/Homepage/CustomButton/CustomButton";
import axios from "axios";
import { JWTCookie, UserCookie } from "../../../app/cookie";
import Loader from "../../../hoc/Loader/Loader";

const LoginPage = (props) => {
  const [submit, setSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [wrongCredentialsMsg, setWrongCredentialsMsg] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const [enterClicked, setEnterClicked] = useState(false);
  const [loader, setLoader] = useState(false);

  const getEmailValue = (value) => {
    if (value.trim() !== "") {
      setEmail(value);
    }
  };

  const getPasswordValue = (value) => {
    if (value.trim() !== "") {
      setPassword(value);
    }
  };

  const { loggedin } = useSelector((state) => state);

  const loginDispatch = useDispatch(setLoggedin);
  const currentUserDispatch = useDispatch(setCurrentUser);
  const history = useHistory();

  const clickHandler = () => {
    setSubmit(true);
    setBtnClicked(true);
    setTimeout(() => {
      setSubmit(false);
      setBtnClicked(false);
    }, 1000);
    clearTimeout();
  };

  useEffect(() => {
    if (loggedin.status) {
      history.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (password !== "" && email !== "" && btnClicked) {
      loginHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, email, btnClicked]);

  const loginHandler = () => {
    setLoader(true);
    const data = {
      username: email,
      password: password,
    };
    axios
      .post("/users/login", data)
      .then((res) => {
        if (res.data.success) {
          const jwtCookie = new JWTCookie();
          const userCookie = new UserCookie();
          jwtCookie.save(res);
          userCookie.save(res);
          const { username, firstname, lastname, email, image } = res.data.user;
          currentUserDispatch(setCurrentUser({ username, firstname, lastname, email, image }));
          loginDispatch(setLoggedin({ success: true, token: res.data.token }));
          history.push("/");
          history.go();
        } else {
          setWrongCredentialsMsg(res.data.msg);
          setWrongCredentials(true);
        }
      })
      .catch((err) => console.log(err));
    setLoader(false);
  };

  const notificationShowHandler = (e) => {
    setWrongCredentials(e);
  };

  const enterClickedHandler = (value) => {
    if (value === "true") {
      setEnterClicked(true);
    } else {
      setEnterClicked(false);
    }
  };

  return (
    <SecondaryPageContainer>
      {loader ? <Loader /> : null}
      <WhiteContainer>
        <SecondaryPageHeader>Login</SecondaryPageHeader>
        <div className={classes.form}>
          <FormGroup type="text" name="username or email" getValue={getEmailValue} submit={submit} enterCLicked={enterClickedHandler}>
            Username/Email
          </FormGroup>
          <FormGroup type="password" name="password" getValue={getPasswordValue} submit={submit} enterCLicked={enterClickedHandler}>
            Password
          </FormGroup>
        </div>
        <div className={classes.btnContainer}>
          <Link to="/forgot_password" className={classes.forgotPassword}>
            Forgot your password?
          </Link>
          <CustomButton onClick={clickHandler} enterClicked={enterClicked}>
            Login
          </CustomButton>
        </div>
        {wrongCredentials ? (
          <Notification shown={notificationShowHandler} type="alert">
            {wrongCredentialsMsg}
          </Notification>
        ) : null}
      </WhiteContainer>
    </SecondaryPageContainer>
  );
};

export default LoginPage;
