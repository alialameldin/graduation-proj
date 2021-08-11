import React, { useEffect, useRef } from "react";
import classes from "./GameVideoScreen.module.css";

const GameVideoScreen = (props) => {
  const videoRef = useRef();

  useEffect(() => {
    videoRef.current.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.levelNum]);

  const positiveClickHandler = () => {
    props.clickHandler("positive");
  };

  const negativeClickHandler = () => {
    props.clickHandler("negative");
  };

  return (
    <div className={classes.GameVideoScreen}>
      <div className={classes.container}>
        <div className={classes.upperSection}>
          <div className={classes.level}>
            <p>Level {props.levelNum}</p>
          </div>
          <div className={classes.xp}>
            <p>{props.xp} XP</p>
          </div>
        </div>
        <div className={classes.videoContainer}>
          <video ref={videoRef} controls>
            <source src={`images/GameVideos/${props.levelNum}.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={classes.buttonsContainer}>
          <div className={[classes.negativeBtn, classes.button].join(" ")} onClick={negativeClickHandler}>
            <img src="/images/GameVideos/negative-review.jpg" alt="positive" />
            <p>Negative</p>
          </div>
          <div className={[classes.positiveBtn, classes.button].join(" ")} onClick={positiveClickHandler}>
            <img src="/images/GameVideos/positive-review.jpg" alt="positive" />
            <p>Positive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameVideoScreen;
