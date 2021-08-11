import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import classes from "./SignupPage.module.css";
import SecondaryPageHeader from "../../../components/Homepage/SecondaryPageHeader/SecondaryPageHeader";
import SecondaryPageContainer from "../../../containers/Homepage/SecondaryPageContainer/SecondaryPageContainer";
import WhiteContainer from "../../../containers/Homepage/WhiteContainer/WhiteContainer";
import FormGroup from "../../../components/Homepage/FormGroup/FormGroup";
import CustomButton from "../../../components/Homepage/CustomButton/CustomButton";
import Notification from "../../../components/Homepage/Notification/Notification";
import Loader from "../../../hoc/Loader/Loader";

const SignupPage = (props) => {
  const [submit, setSubmit] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const [enterClicked, setEnterClicked] = useState(false);
  const [loader, setLoader] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("");

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
    if (firstname !== "" && lastname !== "" && username !== "" && email !== "" && password !== "" && confirmPassword !== "" && btnClicked) {
      if (password === confirmPassword) {
        signupHandler();
      } else {
        setNotificationMsg("Password and confirm password don't match");
        setNotificationType("alert");
        setShowNotification(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, confirmPassword, btnClicked]);

  const signupHandler = () => {
    const data = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    setLoader(true);
    axios
      .post("/users/signup", data)
      .then((res) => {
        if (res.data.success) {
          setNotificationType("success");
          setTimeout(() => {
            history.push("/");
          }, 4000);
          setNotificationMsg(res.data.msg + " You will be redirected to homepage in 4 seconds.");
        } else {
          setNotificationType("alert");
          setNotificationMsg(res.data.msg);
          console.log(res.data.error);
        }
        setShowNotification(true);
      })
      .catch((err) => console.log(err));
    setLoader(false);
  };

  const notificationShowHandler = (e) => {
    setShowNotification(e);
  };

  const enterClickedHandler = (value) => {
    if (value === "true") {
      setEnterClicked(true);
    } else {
      setEnterClicked(false);
    }
  };

  return (
    <SecondaryPageContainer signup>
      {loader ? <Loader /> : null}
      <WhiteContainer>
        <SecondaryPageHeader>Signup</SecondaryPageHeader>
        <div className={classes.form}>
          <FormGroup type="text" name="first name" getValue={(e) => setFirstname(e)} submit={submit} enterCLicked={enterClickedHandler}>
            First Name
          </FormGroup>
          <FormGroup type="text" name="last name" getValue={(e) => setLastname(e)} submit={submit} enterCLicked={enterClickedHandler}>
            Last Name
          </FormGroup>
          <FormGroup type="text" name="username" getValue={(e) => setUsername(e)} submit={submit} enterCLicked={enterClickedHandler}>
            Username
          </FormGroup>
          <FormGroup type="email" name="email" getValue={(e) => setEmail(e)} submit={submit} enterCLicked={enterClickedHandler}>
            Email
          </FormGroup>
          <FormGroup type="password" name="password" getValue={(e) => setPassword(e)} submit={submit} enterCLicked={enterClickedHandler}>
            Password
          </FormGroup>
          <FormGroup type="password" name="confirm password" getValue={(e) => setConfirmPassword(e)} submit={submit} enterCLicked={enterClickedHandler}>
            Confirm password
          </FormGroup>
        </div>
        <div className={classes.btnContainer}>
          <CustomButton onClick={clickHandler} enterClicked={enterClicked}>
            Submit
          </CustomButton>
        </div>
        {showNotification ? (
          <Notification shown={notificationShowHandler} type={notificationType}>
            {notificationMsg}
          </Notification>
        ) : null}
      </WhiteContainer>
    </SecondaryPageContainer>
  );
};

export default SignupPage;
