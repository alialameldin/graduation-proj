import React from "react";
import classes from "./MSASection.module.css";
import SectionHeader from "../../../components/Homepage/SectionHeader/SectionHeader";

const MSASection = (props) => {
  return (
    <div className={classes.MSASection}>
      <div className={classes.container}>
        <img className={classes.sectionImage} src="/images/phone_sentiment.png" alt="phone_sentiment" />
        <div className={classes.textContainer}>
          <SectionHeader>What is Multimodal Sentiment Analysis?</SectionHeader>
          <div className={classes.textBody}>
            <p>
              Multimodal sentiment analysis is a new dimension of the traditional text-based sentiment analysis, which goes beyond the analysis of texts, and
              includes other modalities such as audio and visual data.
            </p>
          </div>
        </div>
      </div>
      <img className={classes.singleCircles1} src="/images/single_circles.png" alt="circles" />
    </div>
  );
};

export default MSASection;
