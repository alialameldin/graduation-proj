import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classes from "./DBNavItem.module.css";
import { setMobileDashNavOpen } from "../../../features/mobileDashNavSlice";

const DBNavItem = (props) => {
  const [isNotification, setNotification] = useState(false);
  const { screen } = useSelector((state) => state);
  const dispatch = useDispatch(setMobileDashNavOpen);
  const clickHandler = () => {
    props.selHandler(props.label);
    if (screen === "Mobile") {
      dispatch(setMobileDashNavOpen(false));
    }
  };

  useEffect(() => {
    if (props.selected === props.label) {
      setNotification(false);
    }
  }, [props.label, props.selected]);

  return (
    <Link to={props.label} className={classes.link}>
      <div className={[classes.DBNavItem, props.selected === props.label ? classes.selected : null].join(" ")} onClick={clickHandler}>
        <i className={props.icon}></i>
        <p>{props.text}</p>
        {props.models && isNotification ? <h6 className={classes.notifications}>2</h6> : null}
      </div>
    </Link>
  );
};

export default DBNavItem;
