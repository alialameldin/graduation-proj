import React, { useState, useEffect } from "react";
import classes from "./VerifyEmail.module.css";
import SecondaryPageHeader from "../../../components/Homepage/SecondaryPageHeader/SecondaryPageHeader";
import SecondaryPageContainer from "../../../containers/Homepage/SecondaryPageContainer/SecondaryPageContainer";
import WhiteContainer from "../../../containers/Homepage/WhiteContainer/WhiteContainer";
import CustomButton from "../../../components/Homepage/CustomButton/CustomButton";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import Loader from "../../../hoc/Loader/Loader";
import Notification from "../../../components/Homepage/Notification/Notification";

const VerifyEmail = (props) => {
  const [valid, setValid] = useState(true);
  const [btnText, setBtnText] = useState("Home");
  const [content, setContent] = useState("Hello my friend");
  const [loader, setLoader] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState("");

  const history = useHistory();
  const { id, token } = useParams();

  useEffect(() => {
    setLoader(true);
    const data = {
      id: id,
      token: token,
    };
    axios
      .post("/users/verify_email", data)
      .then((res) => {
        setLoader(false);
        if (res.data.success) {
          setValid(true);
          setBtnText("Home");
        } else {
          setValid(false);
          setBtnText("Resend verification email");
        }
        setContent(res.data.msg);
      })
      .catch((err) => setContent("There was an error!"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickHandler = () => {
    if (valid) {
      history.replace("/");
    } else {
      axios
        .post("/users/resend_verification_email", { id: id })
        .then((res) => {
          if (res.data.success) {
            setNotificationType("success");
          } else {
            setNotificationType("alert");
          }
          setNotificationMsg(res.data.msg);
          setShowNotification(true);
        })
        .catch((err) => setContent("There was an error!"));
    }
  };

  const notificationShowHandler = (e) => {
    setShowNotification(e);
  };

  return (
    <SecondaryPageContainer>
      {loader ? <Loader /> : null}
      <WhiteContainer>
        <SecondaryPageHeader>Email verification</SecondaryPageHeader>
        <div className={classes.container}>
          {valid ? (
            <i className={["fa fa-check-circle", classes.successIcon].join(" ")}></i>
          ) : (
            <i className={["fa fa-times-circle", classes.failIcon].join(" ")}></i>
          )}
          <p className={classes.content}>{content}</p>
        </div>
        <div className={classes.btnContainer}>
          <CustomButton onClick={clickHandler}>{btnText}</CustomButton>
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

export default VerifyEmail;
