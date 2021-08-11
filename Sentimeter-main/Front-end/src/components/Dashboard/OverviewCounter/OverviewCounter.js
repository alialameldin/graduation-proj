import React from "react";
import classes from "./OverviewCounter.module.css";
import CountUp from "react-countup";
import "./overCounter.css";

const OverviewCounter = (props) => {
  return (
    <div className={classes.OverviewCounter}>
      <div className={classes.counterParent}>
        <CountUp end={props.end} duration={3} className="overcounter" />
        <i className={[`fa fa-${props.icon}`, classes.bookmarkIcon].join(" ")} style={{ color: `${props.color}` }}></i>
      </div>
      <p className={classes.sectionItemText}>{props.children}</p>
    </div>
  );
};

export default OverviewCounter;
