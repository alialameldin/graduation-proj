import React from "react";
import classes from "./HomeLayout.module.css";

const HomeLayout = (props) => {
  return <div className={classes.HomeLayout}>{props.children}</div>;
};

export default HomeLayout;
