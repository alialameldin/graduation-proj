import React, { useEffect } from "react";
import classes from "./DatasetCreator.module.css";
import Navbar from "../../containers/Homepage/Navbar/Navbar";
import Footer from "../../containers/Homepage/Footer/Footer";
import BackToTop from "../../components/Homepage/BackToTop/BackToTop";
import SectionHeader from "../../containers/Aboutpage/SectionHeader/SectionHeader";
import axios from "axios";

const DatasetCreator = (props) => {
  useEffect(() => {
    document.title = "Sentimeter | Dataset Creator";
    return () => (document.title = "Sentimeter");
  }, []);

  const downloadWindowsClickHandler = () => {
    axios
      .get("/exec_files/windows")
      .then((res) => {
        if (res.data.success) {
          window.open(res.data.url);
        }
      })
      .catch((err) => console.log(err));
  };

  const downloadLinuxClickHandler = () => {
    axios
      .get("/exec_files/linux")
      .then((res) => {
        window.open(res.data.url);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.DatasetCreator}>
      <Navbar />
      <div className={classes.section1}>
        <div className={classes.body}>
          <div className={classes.leftSide}>
            <SectionHeader>What is Dataset Creator?</SectionHeader>
            <p className={classes.text}>
              Sentimeter's Dataset Creator is a tool designed to preprare the dataset for you. Just give it the path of your collected videos then watch the
              magic while it is happening. It will split every video of yours to small pieces, extract the audio of each chuck into a separate wav file,
              generate the text of every word said from each audio file, and help you labeling each sample with 'positive' or 'negative' labels. Cool, right?
              You have to give it a try right now.
            </p>
          </div>
          <div className={classes.rightSide}>
            <img src="/images/dataset_creator.jpg" alt="dataset_creator" />
          </div>
        </div>
      </div>
      <div className={classes.section2}>
        <div className={classes.body}>
          <SectionHeader>Download it now</SectionHeader>
          <p className={classes.text}>Download Dataset Creator executable file for your platform.</p>
          <div className={classes.downloadBtns}>
            <div className={classes.downloadBtn}>
              <h3 className={classes.downloadBtnHeader}>
                <i className="fab fa-windows"></i>Microsoft Windows
              </h3>
              <div className={classes.dash}></div>
              <p className={classes.downloadBtnText}>Download Dataset Creator for Microsoft Windows.</p>
              <button className={classes.downloadBtnBtn} onClick={downloadWindowsClickHandler}>
                Download for Windows
              </button>
            </div>
            <div className={classes.downloadBtn}>
              <h3 className={classes.downloadBtnHeader}>
                <i className="fab fa-linux"></i>Linux: Debian
              </h3>
              <div className={classes.dash}></div>
              <p className={classes.downloadBtnText}>Download Dataset Creator for ubuntu/debian distribution.</p>
              <button className={classes.downloadBtnBtn} onClick={downloadLinuxClickHandler}>
                Download for Linux
              </button>
            </div>
          </div>
        </div>
      </div>
      <BackToTop />
      <Footer />
    </div>
  );
};

export default DatasetCreator;
