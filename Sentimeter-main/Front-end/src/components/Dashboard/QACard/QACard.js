import React, { useState } from "react";
import { useSpring, animated, config } from "react-spring";
import { useMeasure } from "react-use";
import classes from "./QACard.module.css";

const QACard = (props) => {
  const [open, setOpen] = useState(false);
  const [measureRef, { height }] = useMeasure();

  const expand = useSpring({
    config: config.default,
    from: {
      height: 0,
      transform: "translateY(-1rem)",
    },
    to: {
      transform: open ? "translateY(0rem)" : "translateY(-1rem)",
      height: open ? height + 4 * 16 : 0,
    },
  });

  return (
    <div className={classes.QACard} style={expand}>
      <div className={classes.question} onClick={() => setOpen(!open)}>
        <h3>{props.question}</h3>
        <span>
          <i className={`fa fa-chevron-${open ? "up" : "down"}`}></i>
        </span>
      </div>
      <animated.div className={classes.answerParent} style={expand}>
        <p ref={measureRef} className={classes.answer}>
          {props.children}
        </p>
      </animated.div>
    </div>
  );
};

export default QACard;
