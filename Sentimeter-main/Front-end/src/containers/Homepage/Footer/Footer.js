import React from "react";
import classes from "./Footer.module.css";

const Footer = (props) => {
  return (
    <div className={classes.Footer}>
      <div className={classes.body}>
        <p>Sentimeter &copy; 2021.</p>
        <p className={classes.rights}>All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
