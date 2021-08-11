import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Navbar from "../../../containers/Dashboard/Navbar/Navbar";
import Loader from "../../../hoc/Loader/Loader";
import axios from "axios";
import { config, useSpring, animated, useChain } from "react-spring";
import classes from "./UserPage.module.css";
import { useSelector } from "react-redux";
import NoMatches from "../../../components/Dashboard/NoMatches/NoMatches";
import ModelsArray from "../../../containers/Dashboard/ModelsArray/ModelsArray";

const UserPage = (props) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [userModels, setUserModels] = useState(null);
  const [ready, setReady] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const { loggedin } = useSelector((state) => state);
  const history = useHistory();
  const axiosConfig = {
    headers: {
      Authorization: loggedin.token,
    },
  };

  const leftSideSpring = useSpring({
    from: {
      transform: "translate(-100%, 0)",
    },
    to: {
      transform: ready ? "translate(0, 0)" : "translate(-100%, 0)",
    },
    config: config.default,
  });

  const escKeyListener = (e) => {
    e.preventDefault();
    if ((e.key === "Escape") & showImageModal) {
      setShowImageModal(false);
    }
  };
  window.addEventListener("keydown", escKeyListener);

  useEffect(() => {
    if (showImageModal) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
    }
  }, [showImageModal]);

  useEffect(() => {
    if (!loggedin.status) {
      history.replace("/login");
      return;
    }

    axios
      .get(`/users/users/${username}`, axiosConfig)
      .then((res) => {
        if (res.data.success) {
          const data = { ...res.data.data };
          delete data.models;
          console.log(res.data.data.models);
          setUserData(data);
          setUserModels(res.data.data.models);
          setReady(true);
        } else {
          if (res.data.notFound) {
            history.replace("/404");
          }
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wrapperRef = useRef();
  const wrapperRefTwo = useRef();
  const modalRef = useRef();

  const wrapperSpring = useSpring({
    ref: wrapperRef,
    from: {
      pointerEvents: "none",
      opacity: 0,
      height: "100vh",
    },
    to: {
      height: showImageModal ? "100vh" : "100vh",
      pointerEvents: showImageModal ? "all" : "none",
      opacity: showImageModal ? 1 : 0,
    },
    config: config.default,
  });

  const modalSpring = useSpring({
    ref: modalRef,
    from: {
      opacity: 0,
      transform: "translateY(-20px)",
    },
    to: {
      transform: showImageModal ? "translateY(0)" : "translateY(-20px)",
      opacity: showImageModal ? 1 : 0,
    },
    config: config.gentle,
  });

  useChain(props.show ? [wrapperRef, modalRef] : [modalRef, wrapperRef], [0, 2]);

  const wrapperClichHandler = (e) => {
    e.preventDefault();
    if (e.target === wrapperRefTwo.current) {
      setShowImageModal(false);
    }
  };

  const imageClickHandler = () => {
    if (userData.image) {
      setShowImageModal(true);
    }
  };

  return (
    <div className={classes.UserPage}>
      <Navbar />
      {userData ? (
        <div className={classes.body}>
          <animated.div style={leftSideSpring} className={classes.leftSide}>
            <div className={classes.imageContainer}>
              <img
                className={[classes.userImage, userData.image ? classes.clickableImage : null].join(" ")}
                src={userData.image ? userData.image : "/images/userImageNotFound.jpg"}
                alt="user_photo"
                onClick={imageClickHandler}
              />
            </div>
            <p className={classes.name}>
              {userData.firstname} {userData.lastname}
            </p>
          </animated.div>
          <div className={classes.rightSide}>
            <div className={classes.container}>
              <h3 className={classes.modelsHeader}>{userData.firstname}'s Models</h3>
              <div className={classes.dash}></div>
              {userModels ? (
                userModels.length === 0 ? (
                  <NoMatches>{userData.username} hasn't created any models yet.</NoMatches>
                ) : (
                  <ModelsArray models={userModels} />
                )
              ) : null}
            </div>
          </div>
          <animated.div style={wrapperSpring} ref={wrapperRefTwo} className={classes.imageModalWrapper} onClick={wrapperClichHandler}>
            <animated.div style={modalSpring} className={classes.imageModal}>
              <img src={userData.image ? "/images/userImageNotFound.jpg" : "/images/userImageNotFound.jpg"} alt="user_photo" />
            </animated.div>
          </animated.div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default UserPage;
