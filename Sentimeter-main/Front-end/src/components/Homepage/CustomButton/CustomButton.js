import React, { useEffect, useRef } from "react";
import classes from "./CustomButton.module.css";

const CustomButton = (props) => {
  const btnRef = useRef();
  useEffect(() => {
    if (props.enterClicked) {
      btnRef.current.click();
    }
  }, [props.enterClicked]);
  return (
    <button ref={btnRef} className={classes.CustomButton} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default CustomButton;
