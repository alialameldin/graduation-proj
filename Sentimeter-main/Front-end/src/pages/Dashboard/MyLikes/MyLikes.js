import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import NoMatches from "../../../components/Dashboard/NoMatches/NoMatches";
import PageTitle from "../../../components/Dashboard/PageTitle/PageTitle";
import ModelsArray from "../../../containers/Dashboard/ModelsArray/ModelsArray";
import Loader from "../../../hoc/Loader/Loader";
import classes from "./MyLikes.module.css";

const MyLikes = (props) => {
  const [models, setModels] = useState([]);
  const [noData, setNoData] = useState(false);

  const { likedModels, loggedin, refreshPage } = useSelector((state) => state);

  const config = {
    headers: {
      authorization: loggedin.token,
    },
  };

  const history = useHistory();

  useEffect(() => {
    if (refreshPage) {
      history.go();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshPage]);

  useEffect(() => {
    if (models.length === 0) {
      setNoData(true);
      setTimeout(() => {
        setNoData(false);
      }, 1000);
    } else {
      clearTimeout();
      setNoData(false);
    }
  }, [models]);

  useEffect(() => {
    axios
      .get("/models/likes", config)
      .then((res) => {
        if (res.data.success) {
          setModels(res.data.data);
        } else {
          console.log(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likedModels]);

  return (
    <div className={classes.MyLikes}>
      <PageTitle>My Likes</PageTitle>
      {noData ? <Loader /> : models.length === 0 ? <NoMatches>You haven't liked any model yet.</NoMatches> : <ModelsArray models={models} />}
    </div>
  );
};

export default MyLikes;
