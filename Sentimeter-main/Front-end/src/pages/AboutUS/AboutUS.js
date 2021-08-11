import React, { useEffect } from "react";
import AboutUsSection from "../../containers/Aboutpage/AboutUsSection/AboutUsSection";
import TeamMembers from "../../containers/Aboutpage/TeamMembers/TeamMembers";
import Navbar from "../../containers/Homepage/Navbar/Navbar";
import Footer from "../../containers/Homepage/Footer/Footer";
import classes from "./AboutUS.module.css";
import BackToTop from "../../components/Homepage/BackToTop/BackToTop";

const AboutUS = (props) => {
  useEffect(() => {
    document.title = "Sentimeter | About US";
    return () => (document.title = "Sentimeter");
  }, []);

  return (
    <div className={classes.AboutUS}>
      <Navbar />
      <div className={classes.body}>
        <AboutUsSection />
        <TeamMembers />
      </div>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default AboutUS;
