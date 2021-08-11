import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Notification from "../../../components/Dashboard/Notification/Notification";
import PageTitle from "../../../components/Dashboard/PageTitle/PageTitle";
import classes from "./Newsletter.module.css";
import axios from "axios";

const Newsletter = (props) => {
  const [subscribed, setSubscribed] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  const { loggedin } = useSelector((state) => state);

  const config = {
    headers: {
      Authorization: loggedin.token,
    },
  };

  useEffect(() => {
    axios
      .get("/dashboard/newsletter/isSubscribed", config)
      .then((res) => {
        if (res.data.success) {
          setSubscribed(res.data.data);
        } else {
          console.log(res.data.msg);
        }
      })
      .catch((error) => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clickHandler = () => {
    if (subscribed) {
      axios
        .get("/dashboard/newsletter/unsubscribe", config)
        .then((res) => {
          if (res.data.success) {
            setNotificationMsg(res.data.msg);
            setSubscribed(false);
          } else {
            setNotificationMsg(res.data.msg);
          }
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .get("/dashboard/newsletter/subscribe", config)
        .then((res) => {
          if (res.data.success) {
            setNotificationMsg(res.data.msg);
            setSubscribed(true);
          } else {
            setNotificationMsg(res.data.msg);
          }
        })
        .catch((err) => console.log(err));
    }
    setNotification(true);
    setTimeout(() => {
      setNotification(false);
    }, 4000);
  };

  return (
    <div className={classes.Newsletter}>
      <PageTitle>Subscribe to Our Newsletter</PageTitle>
      <div className={classes.body}>
        <div className={classes.leftSide}>
          <p className={classes.text}>Subscribe to our newsletter to get the latest updates on our offers, features and new models we provide.</p>
          {subscribed ? (
            <button className={[classes.submitBtn, classes.subscribed].join(" ")} onClick={clickHandler}>
              Unsubscribe
            </button>
          ) : (
            <button className={classes.submitBtn} onClick={clickHandler}>
              Subscribe
            </button>
          )}
          {/* {subscribed ? <p className={classes.text2}>Note: You are already subscribed to our newsletter.</p> : null} */}
        </div>
        <img src="/images/newsletter.svg" alt="newsletter" className={classes.newsImg} />
      </div>
      {notification ? <Notification>{notificationMsg}</Notification> : null}
    </div>
  );
};

export default Newsletter;
