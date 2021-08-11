import React from "react";
import classes from "./SectionHeader.module.css";

const SectionHeader = (props) => {
  return <h1 className={classes.SectionHeader}>{props.children}</h1>;
};

export default SectionHeader;
