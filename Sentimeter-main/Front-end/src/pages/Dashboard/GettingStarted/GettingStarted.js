/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Link } from "react-router-dom";
import PageTitle from "../../../components/Dashboard/PageTitle/PageTitle";
import classes from "./GettingStarted.module.css";
import "./transitions.css";
import GSSlideItem from "../../../components/Dashboard/GSSlideItem/GSSlideItem";

const GettingStarted = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [nextToDone, setNextToDone] = useState(false);
  const [isToNext, setIsToNext] = useState(null);

  const FINAL_INDEX = 4;
  let content = null;

  useEffect(() => {
    if (currentIndex > 0) {
      setShowBack(true);
    } else {
      setShowBack(false);
    }
    if (currentIndex >= FINAL_INDEX) {
      setNextToDone(true);
    } else {
      setNextToDone(false);
    }
  }, [currentIndex]);

  const nextClickHandler = () => {
    setCurrentIndex(currentIndex + 1);
    setIsToNext(true);
  };

  const backClickHandler = () => {
    setCurrentIndex(currentIndex - 1);
    setIsToNext(false);
  };

  switch (currentIndex) {
    case 0:
      content = (
        <GSSlideItem index={currentIndex} header="Welcome to Sentimeter" img="/images/GettingStarted/0.svg" label="welcome_image">
          Welcome to Sentimeter's dashboard. Here, you can upload your own datasets, choose any architecture of the ones already implemented for you, train your
          own models, and use them for any further predictions.
          <br />
          <br />
          Here we will go for a tour together to get to know the process better.
          <br />
          <br />
          <span className={[classes.boldText, classes.clickable].join(" ")} onClick={nextClickHandler}>
            Let's get started.
          </span>
        </GSSlideItem>
      );
      break;
    case 1:
      content = (
        <GSSlideItem index={currentIndex} header="Prepare your dataset" img="/images/GettingStarted/1.svg" label="upload_dataset">
          First of all, you have to create your own dataset. For this task, we can use the help of our great friend,{" "}
          <span className={[classes.boldText, classes.clickable].join(" ")} onClick={() => window.open("/dataset_creator", "_blank")}>
            Dataset Creator
          </span>
          .
          <br />
          <br />
          <span className={classes.boldText}>Dataset Creator</span> is a tool designed to preprare the dataset for you. Just give it the path of your collected
          videos then watch the magic while it is happening. It will <span className={classes.inclinedText}>split every video of ours to small pieces</span>,{" "}
          <span className={classes.inclinedText}>extract the audio of each chuck into a separate wav file</span>,{" "}
          <span className={classes.inclinedText}>generate the text of every word said from each audio file</span>, and help you{" "}
          <span className={classes.inclinedText}>labeling each sample with 'positive' or 'negative' labels</span>. Cool, right?
          <br />
          You have to give it a try right now.
        </GSSlideItem>
      );
      break;
    case 2:
      content = (
        <GSSlideItem index={currentIndex} header="Prepare your dataset" img="/images/GettingStarted/2.svg" label="upload_dataset">
          First of all, you have to create your own dataset. For this task, we can use the help of our great friend,{" "}
          <span className={[classes.boldText, classes.clickable].join(" ")} onClick={() => window.open("/dataset_creator", "_blank")}>
            Dataset Creator
          </span>
          .
          <br />
          <br />
          <span className={classes.boldText}>Dataset Creator</span> is a tool designed to preprare the dataset for you. Just give it the path of your collected
          videos then watch the magic while it is happening. It will <span className={classes.inclinedText}>split every video of ours to small pieces</span>,{" "}
          <span className={classes.inclinedText}>extract the audio of each chuck into a separate wav file</span>,{" "}
          <span className={classes.inclinedText}>generate the text of every word said from each audio file</span>, and help you{" "}
          <span className={classes.inclinedText}>labeling each sample with 'positive' or 'negative' labels</span>. Cool, right?
          <br />
          You have to give it a try right now.
        </GSSlideItem>
      );
      break;
    case 3:
      content = (
        <GSSlideItem index={currentIndex} header="Prepare your dataset" img="/images/GettingStarted/3.svg" label="upload_dataset">
          First of all, you have to create your own dataset. For this task, we can use the help of our great friend,{" "}
          <span className={[classes.boldText, classes.clickable].join(" ")} onClick={() => window.open("/dataset_creator", "_blank")}>
            Dataset Creator
          </span>
          .
          <br />
          <br />
          <span className={classes.boldText}>Dataset Creator</span> is a tool designed to preprare the dataset for you. Just give it the path of your collected
          videos then watch the magic while it is happening. It will <span className={classes.inclinedText}>split every video of ours to small pieces</span>,{" "}
          <span className={classes.inclinedText}>extract the audio of each chuck into a separate wav file</span>,{" "}
          <span className={classes.inclinedText}>generate the text of every word said from each audio file</span>, and help you{" "}
          <span className={classes.inclinedText}>labeling each sample with 'positive' or 'negative' labels</span>. Cool, right?
          <br />
          You have to give it a try right now.
        </GSSlideItem>
      );
      break;
    case 4:
      content = (
        <GSSlideItem index={currentIndex} header="Use your model for prediction" img="/images/GettingStarted/4.svg" label="upload_dataset">
          First of all, you have to create your own dataset. For this task, we can use the help of our great friend,{" "}
          <span className={[classes.boldText, classes.clickable].join(" ")} onClick={() => window.open("/dataset_creator", "_blank")}>
            Dataset Creator
          </span>
          .
          <br />
          <br />
          <span className={classes.boldText}>Dataset Creator</span> is a tool designed to preprare the dataset for you. Just give it the path of your collected
          videos then watch the magic while it is happening. It will <span className={classes.inclinedText}>split every video of ours to small pieces</span>,{" "}
          <span className={classes.inclinedText}>extract the audio of each chuck into a separate wav file</span>,{" "}
          <span className={classes.inclinedText}>generate the text of every word said from each audio file</span>, and help you{" "}
          <span className={classes.inclinedText}>labeling each sample with 'positive' or 'negative' labels</span>. Cool, right?
          <br />
          You have to give it a try right now.
        </GSSlideItem>
      );
      break;

    default:
      content = null;
      break;
  }

  return (
    <div className={classes.GettingStarted}>
      <PageTitle>Getting Started</PageTitle>
      <div className={classes.container}>
        <div className={[classes.body, isToNext ? "nextSlide" : "prevSlide"].join(" ")}>
          <TransitionGroup>
            <CSSTransition key={currentIndex} timeout={1000} classNames="slide">
              <div className={classes.slideItem}>{content}</div>
            </CSSTransition>
          </TransitionGroup>
        </div>
        <div className={classes.btnsContainer}>
          <button className={[classes.backBtn, showBack ? classes.showBtn : null].join(" ")} onClick={backClickHandler}>
            Back
          </button>
          {!nextToDone ? (
            <button className={classes.nextBtn} onClick={nextClickHandler}>
              Next
            </button>
          ) : (
            <button className={classes.nextBtn}>
              <Link to="/dashboard/overview">Done</Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;
