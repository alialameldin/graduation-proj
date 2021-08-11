import React, { useEffect, useState } from "react";
import classes from "./SecondaryPageContainer.module.css";
import { Link } from "react-router-dom";
import { useSpring, animated, config } from "react-spring";

const SecondaryPageContainer = (props) => {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setStarted(true);
  }, []);

  const scaleUp = useSpring({
    from: {
      transform: "scale(0.8)",
      opacity: 0.1,
    },
    to: {
      transform: started ? "scale(1)" : "scale(0.8)",
      opacity: started ? 0.4 : 0.1,
    },
    config: config.gentle,
  });

  return (
    <div className={[classes.SecondaryPageContainer, props.signup ? classes.signup : null].join(" ")}>
      <div className={classes.backToHomeBtn}>
        <Link to="/">
          <div className={classes.backToHomeText}>
            <i className="fa fa-chevron-left"></i>
            <p> Back to home</p>
          </div>
        </Link>
      </div>
      <div className={classes.container}>{props.children}</div>
      <animated.img style={scaleUp} className={classes.singleCircles1} src="/images/single_circles.png" alt="single_circles" />
      <animated.img style={scaleUp} className={classes.doubleCircles1} src="/images/double_circles.png" alt="double_circles" />
    </div>
  );
};

export default SecondaryPageContainer;
