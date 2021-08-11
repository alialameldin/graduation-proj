import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../containers/Homepage/Navbar/Navbar";
import classes from "./PredictionPage.module.css";
import axios from "axios";
import Loader from "../../hoc/Loader/Loader";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";

const PredictionPage = (props) => {
  const { id } = useParams();
  const [model, setModel] = useState({});
  const [showLoader, setShowLoader] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [uploadVideoPage, setUploadVideoPage] = useState(true);
  const [predictClicked, setPredictClicked] = useState(false);
  const [predictionsPage, setPredictionsPage] = useState(false);
  const [prediction, setPrediction] = useState(0);

  const inputRef = useRef();
  const videoRef = useRef();

  const { screen } = useSelector((state) => state);

  useEffect(() => {
    axios
      .get(`/models/${id}`)
      .then((res) => {
        if (res.data.success) {
          setModel(res.data.data);
          setShowLoader(false);
        } else {
          console.log(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedVideo) {
      setShowVideo(true);
    } else {
      setShowVideo(false);
    }
  }, [selectedVideo]);

  const videoSelectHandler = (e) => {
    setSelectedVideo(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = (event) => {
      videoRef.current.setAttribute("src", event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const predictClickHandler = () => {
    setPredictClicked(true);
    setUploadVideoPage(false);
    const videoFormData = new FormData();
    videoFormData.append("video", selectedVideo);
    axios
      .post(`/models/predict/${model.id}`, videoFormData)
      .then((res) => {
        if (res.data.success) {
          setPredictClicked(false);
          setPredictionsPage(true);
          setPrediction(res.data.prediction);
        } else {
          console.log(res.data.msg);
        }
        setSelectedVideo(null);
        setShowVideo(false);
      })
      .catch((err) => console.log(err));
  };

  const returnToVideoHandler = () => {
    setPredictClicked(false);
    setPredictionsPage(false);
    setPrediction(0);
    setUploadVideoPage(true);
  };
  return (
    <div className={classes.PredictionPage}>
      <Navbar />
      {showLoader ? (
        <Loader />
      ) : (
        <div className={classes.container}>
          <h1 className={classes.header}>Predict the sentiment using {model.name} model</h1>
          <div className={classes.dash}></div>
          {uploadVideoPage ? (
            <div className={[classes.body, selectedVideo ? classes.clearPadding : null].join(" ")}>
              {showVideo ? (
                <div className={classes.videoContainer}>
                  <video ref={videoRef} src="" controls></video>
                </div>
              ) : null}
              <div className={classes.videoUploaderInput}>
                <p>
                  {screen !== "Mobile" ? <i className="fas fa-cloud-upload-alt"></i> : null} {!selectedVideo ? "Upload video" : "Upload another video"}
                </p>
                <input className={selectedVideo ? classes.marginInput : null} ref={inputRef} accept="video/mp4" type="file" onChange={videoSelectHandler} />
              </div>
              {showVideo ? (
                <div className={classes.predictBtnContainer}>
                  <button className={classes.predictBtn} onClick={predictClickHandler}>
                    Predict
                  </button>
                </div>
              ) : null}
            </div>
          ) : predictClicked ? (
            <div className={[classes.body, classes.predictingLoaderBody].join(" ")}>
              <img src="/images/predicting_loader.gif" alt="loader" />
              <p>Please wait until the model finishes predicting...</p>
            </div>
          ) : predictionsPage ? (
            <div className={[classes.body, classes.predictionsPageBody].join(" ")}>
              <ProgressBar className={classes.progressbar} completed={prediction} bgColor="#4f97c7" labelColor="#1a3f66" />
              <p>Your video is {prediction}% positive</p>
              <div className={classes.predictBtnContainer}>
                <button className={classes.predictBtn} onClick={returnToVideoHandler}>
                  Predict on another video
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
