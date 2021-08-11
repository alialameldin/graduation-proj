import React from "react";
import classes from "./GSSlideItem.module.css";

const GSSlideItem = (props) => {
  return (
    <div className={classes.GSSlideItem}>
      <div className={classes.imageContainer}>
        <img src={props.img} alt={props.label} />
      </div>
      <div className={classes.textContainer}>
        <h1 className={classes.header}>
          <p className={classes.headerNo}>{props.index}</p> {props.header}
        </h1>
        <p className={classes.text}>{props.children}</p>
      </div>
    </div>
  );
};

export default GSSlideItem;
