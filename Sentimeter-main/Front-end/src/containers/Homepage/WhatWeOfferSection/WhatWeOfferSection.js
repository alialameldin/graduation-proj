import React from "react";
import classes from "./WhatWeOfferSection.module.css";
import SectionHeader from "../../Aboutpage/SectionHeader/SectionHeader";
import sections from "./data";

const WhatWeOfferSection = (props) => {
  return (
    <div className={classes.WhatWeOfferSection}>
      <div className={classes.container}>
        <div className={classes.header}>
          <SectionHeader center>What We Offer</SectionHeader>
        </div>
        <div className={classes.body}>
          {sections.map((section, index) => (
            <div key={index} className={classes.section}>
              <img src={`/images/WhatWeOffer/${section.icon}`} alt="create_dataset" className={classes.sectionIcon} />
              <h3 className={classes.sectionHeader}>{section.header}</h3>
              <p className={classes.sectionBody}>{section.body}</p>
            </div>
          ))}
        </div>
        <img src="/images/single_circles.png" alt="single_circle" className={[classes.singleCircles1, classes.circles].join(" ")} />
        <img src="/images/double_circles.png" alt="double_circle" className={[classes.doubleCircles1, classes.circles].join(" ")} />
      </div>
    </div>
  );
};

export default WhatWeOfferSection;
