import React, { useState, useEffect } from "react";
import classes from "./ForgotPassword.module.css";
import SecondaryPageHeader from "../../../components/Homepage/SecondaryPageHeader/SecondaryPageHeader";
import SecondaryPageContainer from "../../../containers/Homepage/SecondaryPageContainer/SecondaryPageContainer";
import WhiteContainer from "../../../containers/Homepage/WhiteContainer/WhiteContainer";
import FormGroup from "../../../components/Homepage/FormGroup/FormGroup";
import CustomButton from "../../../components/Homepage/CustomButton/CustomButton";
import Notification from "../../../components/Homepage/Notification/Notification";
import Loader from "../../../hoc/Loader/Loader";
import axios from "axios";

const ForgotPassword = (props) => {
  const [submit, setSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const [btnClicked, setBtnClicked] = useState(false);
  const [enterClicked, setEnterClicked] = useState(false);
  const [loader, setLoader] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("");

  const getEmailValue = (value) => {
    setEmail(value);
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
    if (email !== "" && btnClicked) {
      forgetPasswordHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, btnClicked]);

  const forgetPasswordHandler = () => {
    setLoader(true);
    axios
      .post("/users/password/forgot", { email: email })
      .then((res) => {
        if (res.data.success) {
          setNotificationType("success");
        } else {
          setNotificationType("alert");
        }
        setNotificationMsg(res.data.msg);
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
        <SecondaryPageHeader>Forgot password</SecondaryPageHeader>
        <div className={classes.form}>
          <FormGroup type="email" name="email" getValue={getEmailValue} submit={submit} enterCLicked={enterClickedHandler}>
            Email
          </FormGroup>
          <p className={classes.note}>An email will be sent to your inbox if this email is attached to an account in our database.</p>
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

export default ForgotPassword;
