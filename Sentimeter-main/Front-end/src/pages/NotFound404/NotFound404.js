import React from "react";
import { Link } from "react-router-dom";
import classes from "./NotFound404.module.css";
import Svg404 from "./Svg404";

const NotFound404 = (props) => {
  return (
    <div className={classes.NotFound404}>
      <div className={classes.container}>
        {/* <img src="/404.svg" alt="NotFound" /> */}
        <div className={classes.svg}>
          <Svg404 />
        </div>
        <div className={classes.textContainer}>
          <h1 className={classes.header}>Oh No!</h1>
          <p className={classes.text}>You seem that you are stuck in the middle of the nowhere.</p>
        </div>
        <Link to="/" className={classes.btn}>
          <i className="fas fa-home"></i> Take me home
        </Link>
      </div>
    </div>
  );
};

export default NotFound404;
