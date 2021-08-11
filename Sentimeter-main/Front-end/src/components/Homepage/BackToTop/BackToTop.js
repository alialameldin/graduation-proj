import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useSpring, config } from "react-spring";
import classes from "./BackToTop.module.css";

const BackToTop = (props) => {
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(false);

  const { screen } = useSelector((state) => state);

  window.addEventListener(
    "scroll",
    (e) => {
      e.preventDefault();
      if (window.scrollY < 200) {
        setShow(false);
      } else {
        setShow(true);
      }
    },
    false
  );

  const [, setY] = useSpring(() => ({ y: 0 }));

  const clickHandler = () => {
    setY({
      y: 0,
      reset: true,
      from: { y: window.scrollY },
      onFrame: (props) => window.scroll(0, props.y),
      config: config.slow,
    });
  };

  return (
    <div
      className={[classes.BackToTop, show ? classes.show : classes.hide, screen === "Mobile" ? classes.mobile : null].join(" ")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={clickHandler}>
      <p className={classes.plus}>
        <i className="fa fa-arrow-up"></i>
      </p>
      {screen !== "Mobile" && hovered ? <p className={classes.cnmText}>Back to top</p> : null}
    </div>
  );
};

export default BackToTop;
