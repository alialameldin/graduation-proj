import React from "react";
import classes from "./MobileNavItem.module.css";
import { Link } from "react-router-dom";

const MobileNavItem = (props) => {
  return (
    <div className={[classes.MobileNavItem, props.active ? classes.active : null].join(" ")}>
      <Link to={props.url}>
        <div className={classes.iconText}>
          <i className={`fa fa-${props.icon}`}></i> {props.text}
        </div>
      </Link>
    </div>
  );
};

export default MobileNavItem;
