import React from "react";
import SectionHeader from "../SectionHeader/SectionHeader";
import classes from "./AboutUsSection.module.css";

const AboutUsSection = (props) => {
  return (
    <div className={classes.AboutUsSection}>
      <SectionHeader>Who are we?</SectionHeader>
      <div className={classes.body}>
        <p>
          We are a software engineering team, graduated from Faculty of Engineering Ain Shams University, Computer and Systems department. We are passionate
          about Deeplearnig, specially sentiment analysis field. <br></br> Our supervisor Prof. Dr. Ahmed Hassan, Dean of ITCS School Nile University, improved
          the idea of the project and helped us with everything we need and taught us a lot during the production of this project and was very supportive to us.{" "}
          <br></br> Our senior engineer, Eng. Sarah Abdu, was with us step by step during the project and helped us with everything and wasn’t stingy with her
          information she taught us a lot during the project as well. So we thank them very much for their great efforts with us during this project.
        </p>
      </div>
    </div>
  );
};

export default AboutUsSection;
