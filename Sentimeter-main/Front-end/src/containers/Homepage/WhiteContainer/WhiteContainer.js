import React, { useEffect, useState } from "react";
import classes from "./WhiteContainer.module.css";
import { useSpring, animated, config } from "react-spring";

const WhiteContainer = (props) => {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(true);
  }, []);

  const fadeUp = useSpring({
    from: {
      transform: "translateY(10rem)",
      opacity: 0.5,
    },
    to: {
      transform: started ? "translateY(0)" : "translateY(10rem)",
      opacity: started ? 1 : 0.5,
    },
    config: config.gentle,
  });

  return (
    <animated.div className={[classes.WhiteContainer, props.center ? classes.center : null].join(" ")} style={fadeUp}>
      <div className={classes.container}>{props.children}</div>
    </animated.div>
  );
};

export default WhiteContainer;
