import React from "react";
import classes from "./Loader.module.css";

const Loader = (props) => {
  return (
    <div className={[classes.LoaderContainer, props.transparent ? classes.transparent : null].join(" ")}>
      <div className={classes.ldsGrid}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
