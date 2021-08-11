import React from "react";
import classes from "./GameShowResults.module.css";
import CountUp from "react-countup";
import "./counter.css";
import { useHistory } from "react-router-dom";
import WhiteContainer from "../../Homepage/WhiteContainer/WhiteContainer";

const GameShowResults = (props) => {
  const history = useHistory();

  const sadContent = (
    <>
      <i className={["fa fa-sad-tear", classes.sadIcon, classes.icon].join(" ")}></i>
      <p className={[classes.xp, classes.sadXP].join(" ")}>{props.currentXP} XP</p>
      <p className={classes.oops}>
        <span>OOPS!</span> You are wrong.
      </p>
      <p className={classes.paragraph}>Fortunately, our model will guess it right.</p>
    </>
  );

  const happyContent = (
    <>
      <i className={["fa fa-smile-beam", classes.happyIcon, classes.icon].join(" ")}></i>
      <p className={[classes.xp, classes.happyXP].join(" ")}>
        <CountUp end={props.currentXP + 100} start={props.currentXP} duration={2} className="gameLevelCounter" />
        <p> XP</p>
      </p>
      <p className={classes.hurray}>
        <span>HURRAY!</span> You are right.
      </p>
      <p className={classes.paragraph}>But our model could still save you time.</p>
    </>
  );

  const finishContent = (
    <>
      <i className={["fa fa-trophy", classes.happyIcon, classes.icon].join(" ")}></i>
      <p className={[classes.xp, classes.happyXP].join(" ")}>
        <CountUp end={props.maxXPReached} start={0} duration={3} className="gameLevelCounter" />
        <p> / {props.numLevels * 100} XP</p>
      </p>
      <p className={classes.hurray}>
        <span>Finished!</span> The game ended.
      </p>
      <p className={classes.paragraph}>We hope that you may have a better idea on the functionality of our model now.</p>
    </>
  );

  const buttonClickHandler = () => {
    if (props.finish) {
      history.push("/");
    }

    props.showVideo(true);
  };

  return (
    <WhiteContainer center>
      {props.finish ? finishContent : props.isRight ? happyContent : sadContent}
      {props.finish ? (
        <button className={classes.btn} onClick={buttonClickHandler}>
          <i className="fa fa-home"></i> GO HOME
        </button>
      ) : (
        <button className={classes.btn} onClick={buttonClickHandler}>
          Continue
        </button>
      )}
    </WhiteContainer>
  );
};

export default GameShowResults;
