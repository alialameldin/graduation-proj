import React, { useEffect } from "react";
import BackToTop from "../../components/Homepage/BackToTop/BackToTop";
import Banner from "../../containers/Homepage/Banner/Banner";
import Footer from "../../containers/Homepage/Footer/Footer";
import GameSection from "../../containers/Homepage/GameSection/GameSection";
import MSASection from "../../containers/Homepage/MSASection/MSASection";
import Navbar from "../../containers/Homepage/Navbar/Navbar";
import WhatWeOfferSection from "../../containers/Homepage/WhatWeOfferSection/WhatWeOfferSection";
import classes from "./Homepage.module.css";

const Homepage = (props) => {
  useEffect(() => {
    document.title = "Sentimeter";
  }, []);

  return (
    <div className={classes.Homepage}>
      <Navbar />
      <Banner />
      <WhatWeOfferSection />
      <MSASection />
      <GameSection />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Homepage;
