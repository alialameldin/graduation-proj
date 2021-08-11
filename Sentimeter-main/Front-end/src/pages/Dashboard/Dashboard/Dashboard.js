import React from "react";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import DashboardNav from "../../../containers/Dashboard/DashboardNav/DashboardNav";
import Navbar from "../../../containers/Dashboard/Navbar/Navbar";
import Layout from "../../../hoc/Layout/Layout";
import BrowseModels from "../BrowseModels/BrowseModels";
import HelpPage from "../HelpPage/HelpPage";
import MyBookmarks from "../MyBookmarks/MyBookmarks";
import MyLikes from "../MyLikes/MyLikes";
import MyModels from "../MyModels/MyModels";
import Newsletter from "../Newsletter/Newsletter";
import FAQpage from "../FAQpage/FAQpage";
import Overview from "../Overview/Overview";
import GettingStarted from "../GettingStarted/GettingStarted";
import classes from "./Dashboard.module.css";
import { useSelector } from "react-redux";
import CreateModel from "../CreateModel/CreateModel";

const Dashboard = (props) => {
  const location = useLocation();
  const history = useHistory();

  const { loggedin } = useSelector((state) => state);

  useEffect(() => {
    document.title = "Sentimeter | Dashboard";
  }, []);

  useEffect(() => {
    if (!loggedin.status) {
      history.push("/login");
    } else {
      if (location.pathname === "/dashboard") {
        history.push(location.pathname + "/overview");
      } else if (location.pathname === "/dashboard/") {
        history.push(location.pathname + "overview");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedin]);

  let content = null;
  let path = location.pathname.split("/")[location.pathname.split("/").length - 1];

  switch (path) {
    case "overview":
      content = <Overview />;
      break;
    case "getting_started":
      content = <GettingStarted />;
      break;
    case "my_models":
      content = <MyModels />;
      break;
    case "create":
      content = <CreateModel />;
      break;
    case "models":
      content = <BrowseModels />;
      break;
    case "my_likes":
      content = <MyLikes />;
      break;
    case "my_bookmarks":
      content = <MyBookmarks />;
      break;
    case "faq":
      content = <FAQpage />;
      break;
    case "newsletter":
      content = <Newsletter />;
      break;
    case "help":
      content = <HelpPage />;
      break;
    default:
      content = <div className={classes.default}></div>;
      break;
  }

  return (
    <div className={classes.Dashboard}>
      <Navbar />
      <div className={classes.container}>
        <DashboardNav match={props.match} />
        <Layout>{content}</Layout>
      </div>
    </div>
  );
};

export default Dashboard;
