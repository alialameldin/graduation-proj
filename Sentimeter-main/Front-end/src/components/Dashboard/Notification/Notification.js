import React, { useEffect, useState } from "react";
import { useSpring, animated, config } from "react-spring";
import classes from "./Notification.module.css";

const Notification = (props) => {
  const [shown, setShown] = useState(true);

  const spring = useSpring({
    from: {
      opacity: 0,
      pointerEvents: "none",
      transform: "translateY(3rem)",
    },
    opacity: shown ? 1 : 0,
    pointerEvents: shown ? "all" : "none",
    transform: shown ? "translateY(0)" : "translateY(3rem)",
    config: config.default,
  });

  useEffect(() => {
    setTimeout(() => {
      setShown(false);
    }, 3000);
  }, []);

  const clickHandler = () => {
    setShown(false);
  };
  return (
    <animated.div style={spring} className={classes.Notification}>
      <p>{props.children}</p>
      <i className="fa fa-times" onClick={clickHandler}></i>
    </animated.div>
  );
};

export default Notification;
