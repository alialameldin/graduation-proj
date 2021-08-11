import React, { useEffect, useState } from "react";
import NoMatches from "../../../components/Dashboard/NoMatches/NoMatches";
import PageTitle from "../../../components/Dashboard/PageTitle/PageTitle";
import { useSelector } from "react-redux";
import ModelsArray from "../../../containers/Dashboard/ModelsArray/ModelsArray";
import classes from "./MyBookmarks.module.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Loader from "../../../hoc/Loader/Loader";

const MyBookmarks = (props) => {
  const [models, setModels] = useState([]);
  const [noData, setNoData] = useState(false);

  const { bookmarkedModels, loggedin, refreshPage } = useSelector((state) => state);

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
    axios
      .get("/models/bookmarks", config)
      .then((res) => {
        if (res.data.success) {
          setModels(res.data.data);
        } else {
          console.log(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarkedModels]);

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
  return (
    <div className={classes.MyBookmarks}>
      <PageTitle>My Bookmarks</PageTitle>
      {noData ? <Loader /> : models.length === 0 ? <NoMatches>You haven't bookmarked any model yet.</NoMatches> : <ModelsArray models={models} />}
    </div>
  );
};

export default MyBookmarks;
