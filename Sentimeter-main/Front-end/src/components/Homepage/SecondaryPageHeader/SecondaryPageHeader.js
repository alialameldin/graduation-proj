import React, { useEffect, useState } from "react";
import classes from "./SecondaryPageHeader.module.css";
import { useSpring, animated, config } from "react-spring";

const SecondaryPageHeader = (props) => {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStarted(true);
    }, 200);
  }, []);

  const startSpring = useSpring({
    from: {
      width: 0,
    },
    to: {
      width: started ? 50 : 0,
    },
    config: config.gentle,
  });

  return (
    <div className={classes.SecondaryPageHeader}>
      <h1 className={classes.header}>{props.children}</h1>
      <animated.div style={startSpring} className={classes.dash}></animated.div>
    </div>
  );
};

export default SecondaryPageHeader;
