import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import classes from "./ResetPassword.module.css";
import SecondaryPageHeader from "../../../components/Homepage/SecondaryPageHeader/SecondaryPageHeader";
import SecondaryPageContainer from "../../../containers/Homepage/SecondaryPageContainer/SecondaryPageContainer";
import WhiteContainer from "../../../containers/Homepage/WhiteContainer/WhiteContainer";
import FormGroup from "../../../components/Homepage/FormGroup/FormGroup";
import CustomButton from "../../../components/Homepage/CustomButton/CustomButton";
import Notification from "../../../components/Homepage/Notification/Notification";
import Loader from "../../../hoc/Loader/Loader";

const ResetPassword = (props) => {
  const [submit, setSubmit] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const [enterClicked, setEnterClicked] = useState(false);
  const [loader, setLoader] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("");

  const { token } = useParams();
  const history = useHistory();

  const getPasswordValue = (value) => {
    setPassword(value);
  };

  const getConfirmPasswordValue = (value) => {
    setConfirmPassword(value);
  };

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
    if (password !== "" && confirmPassword !== "" && btnClicked) {
      if (password === confirmPassword) {
        resetPasswordHandler();
      } else {
        setNotificationMsg("Password and confirm password don't match");
        setNotificationType("alert");
        setShowNotification(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password, confirmPassword, btnClicked]);

  const resetPasswordHandler = () => {
    const tokenToBeSent = "Bearer " + token;
    const data = {
      password: password,
      confirmPassword: confirmPassword,
      token: tokenToBeSent,
    };
    setLoader(true);
    axios
      .post("/users/password/reset", data)
      .then((res) => {
        if (res.data.success) {
          setNotificationType("success");
          setNotificationMsg(res.data.msg);
          setTimeout(() => {
            history.replace("/login");
          }, 3000);
        } else {
          setNotificationType("alert");
          setNotificationMsg("Can't reset password. Please try again!");
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
    <SecondaryPageContainer>
      {loader ? <Loader /> : null}
      <WhiteContainer>
        <SecondaryPageHeader>Reset password</SecondaryPageHeader>
        <div className={classes.form}>
          <FormGroup type="password" name="password" getValue={getPasswordValue} submit={submit} enterCLicked={enterClickedHandler}>
            New password
          </FormGroup>
          <FormGroup type="password" name="confirm password" getValue={getConfirmPasswordValue} submit={submit} enterCLicked={enterClickedHandler}>
            Confirm new password
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

export default ResetPassword;
