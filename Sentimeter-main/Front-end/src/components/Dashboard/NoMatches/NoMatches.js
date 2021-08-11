import React from "react";
import classes from "./NoMatches.module.css";

const NoMatches = (props) => {
  return (
    <div className={classes.NoMatches}>
      <p>{props.children}</p>
      <img src="/images/noMatches.svg" alt="No Matches" />
    </div>
  );
};

export default NoMatches;
