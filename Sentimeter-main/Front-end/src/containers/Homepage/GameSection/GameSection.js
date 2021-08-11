import React from "react";
import { Link } from "react-router-dom";
import SectionHeader from "../../../components/Homepage/SectionHeader/SectionHeader";
import classes from "./GameSection.module.css";

const GameSection = (props) => {
  return (
    <div className={classes.GameSection}>
      <div className={classes.container}>
        <div className={classes.textContainer}>
          <SectionHeader>Sentimeter: The Game</SectionHeader>
          <div className={classes.textBody}>
            <p>
              This is a demo game, showing how our models train to predict the sentiments of people's reviews videos. They extract the visual expressions
              features, acoustic features, and the textual features of the spoken words. The models get to know that whether the person shouts or stays calm in
              the video, is frown or smiling, and whether they say compliment or aggressive words, these will affect the sentiment prediction. You can simulate
              how they work by watching and game's videos and try to tell the predictions yourself.
            </p>
          </div>
          <div className={classes.btnContainer}>
            <Link to="/game">
              <button className={classes.button}>Start Game</button>
            </Link>
          </div>
        </div>
        <img className={classes.sectionImage} src="/images/video_influencer.png" alt="video_influencer" />
      </div>
      <img className={classes.singleCircles1} src="/images/single_circles.png" alt="circles" />
      <img className={classes.doubleCircles1} src="/images/double_circles.png" alt="circles" />
    </div>
  );
};

export default GameSection;
