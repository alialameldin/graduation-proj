import React from "react";
import classes from "./SectionHeader.module.css";

const SectionHeader = (props) => {
  return (
    <div className={classes.SectionHeader}>
      <h1 className={classes.sectionName}>{props.children}</h1>
      <div className={[classes.dash, props.center ? classes.center : null].join(" ")}></div>
    </div>
  );
};

export default SectionHeader;
