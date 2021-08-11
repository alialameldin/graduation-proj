import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/Dashboard/PageTitle/PageTitle";
import classes from "./Overview.module.css";
import { useSelector } from "react-redux";
import OverviewCounter from "../../../components/Dashboard/OverviewCounter/OverviewCounter";
import axios from "axios";

const Overview = (props) => {
  const [name, setName] = useState("");
  const [bookmarks, setBookmarks] = useState(0);
  const [likes, setLikes] = useState(0);
  const [created, setCreated] = useState(0);
  const { currentUser, loggedin } = useSelector((state) => state);

  const config = {
    headers: {
      authorization: loggedin.token,
    },
  };

  useEffect(() => {
    setName(currentUser.firstname);
    axios.all([axios.get("/models/likes", config), axios.get("/models/bookmarks", config), axios.get("/models/me", config)]).then((res) => {
      if (res[0].data.data) setLikes(res[0].data.data.length);
      if (res[1].data.data) setBookmarks(res[1].data.data.length);
      if (res[2].data.data) setCreated(res[2].data.data.length);
    });
    // axios
    //   .get("/models/bookmarks", config)
    //   .then((res) => {
    //     if (res.data.success) {
    //       setBookmarks(res.data.data.length);
    //     } else {
    //       console.log(res.data.msg);
    //     }
    //   })
    //   .catch((err) => console.log(err));
    // axios
    //   .get("/models/likes", config)
    //   .then((res) => {
    //     if (res.data.success) {
    //       setLikes(res.data.data.length);
    //     } else {
    //       console.log(res.data.msg);
    //     }
    //   })
    //   .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.Overview}>
      <PageTitle>Overview</PageTitle>
      <div className={classes.body}>
        <div className={[classes.welcomeBack, classes.bg].join(" ")}>
          <h2>Welcome back, {name}!</h2>
          <p>Create a new Multimodal Sentiment Analysis (MSA) model to use it in your application right now.</p>
        </div>
        <div className={[classes.myModels, classes.bg].join(" ")}>
          <h4 className={classes.sectionTitle}>My Models</h4>
          <OverviewCounter end={created} icon="plus-circle">
            Models created
          </OverviewCounter>
          <OverviewCounter end={0} icon="spinner">
            Models still training
          </OverviewCounter>
        </div>
        <div className={[classes.models, classes.bg].join(" ")}>
          <h4 className={classes.sectionTitle}>Other Models</h4>
          <OverviewCounter end={likes} icon="heart">
            Models Liked
          </OverviewCounter>
          <OverviewCounter end={bookmarks} icon="bookmark">
            Models Bookmarked
          </OverviewCounter>
        </div>
      </div>
    </div>
  );
};

export default Overview;
