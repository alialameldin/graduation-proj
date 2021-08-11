import React from "react";
import classes from "./PageTitle.module.css";

const PageTitle = (props) => {
  return <h1 className={classes.title}>{props.children}</h1>;
};

export default PageTitle;
