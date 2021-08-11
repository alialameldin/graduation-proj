import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { setMobileDashNavOpen } from "../../../features/mobileDashNavSlice";
import { useSpring, config, animated } from "react-spring";
import DBNavItem from "../../../components/Dashboard/DBNavItem/DBNavItem";
import classes from "./DashboardNav.module.css";

const DashboardNav = (props) => {
  const [selected, setSelected] = useState(null);
  const [isMobile, setMobile] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const { screen, isMobileDashNavOpen } = useSelector((state) => state);
  const dispatch = useDispatch(setMobileDashNavOpen);

  useEffect(() => {
    if (screen === "Mobile") {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [screen]);

  let location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path !== selected) {
      setSelected(path.split("/")[2]);
    }
  }, [location.pathname, selected]);

  const selectHandler = (label) => {
    setSelected(label);
  };

  const overlayRef = useRef();

  useEffect(() => {
    if (isMobileDashNavOpen) {
      setShowMobileNav(true);
    } else {
      setShowMobileNav(false);
    }
  }, [isMobileDashNavOpen]);

  const bodyClickHandler = (e) => {
    e.preventDefault();
    if (e.target === overlayRef.current) {
      dispatch(setMobileDashNavOpen(false));
    }
  };

  const overlaySpring = useSpring({
    from: {
      pointerEvents: "None",
      opacity: 0,
    },
    to: {
      pointerEvents: showMobileNav ? "All" : "None",
      opacity: showMobileNav ? 1 : 0,
    },
    config: config.default,
  });

  const mobileSpring = useSpring({
    from: {
      transform: "translateX(-100%)",
    },
    to: {
      transform: showMobileNav ? "translateX(0)" : "translateX(-100%)",
    },
    config: config.default,
  });

  const content = (
    <>
      <div>
        <div className={classes.section}>
          <h3>Overview</h3>
          <DBNavItem selected={selected} selHandler={selectHandler} label="overview" text="Overview" icon="fa fa-list-ul" />
          <DBNavItem selected={selected} selHandler={selectHandler} label="getting_started" text="Getting Started" icon="fa fa-rocket" />
        </div>
        <div className={classes.section}>
          <h3>Models</h3>
          <DBNavItem selected={selected} selHandler={selectHandler} label="my_models" text="My Models" icon="fa fa-layer-group" models />
          <DBNavItem selected={selected} selHandler={selectHandler} label="models" text="Browse Models" icon="fa fa-search" />
          <DBNavItem selected={selected} selHandler={selectHandler} label="my_likes" text="My Likes" icon="fa fa-heart" />
          <DBNavItem selected={selected} selHandler={selectHandler} label="my_bookmarks" text="My Bookmarks" icon="fa fa-bookmark" />
        </div>
        <div className={classes.section}>
          <h3>Support</h3>
          <DBNavItem selected={selected} selHandler={selectHandler} label="faq" text="Q & A" icon="fa fa-question-circle" />
          <DBNavItem selected={selected} selHandler={selectHandler} label="newsletter" text="Newsletter" icon="fa fa-newspaper" />
          {/* <DBNavItem selected={selected} selHandler={selectHandler} label="help" text="Help" icon="fa fa-info-circle" /> */}
        </div>
      </div>
      <div className={classes.copyrights}>
        <p>Graduation Project &copy; 2021</p>
        <p>All rights reserved.</p>
      </div>
    </>
  );

  const container = isMobile ? (
    <animated.div
      style={overlaySpring}
      ref={overlayRef}
      className={[classes.overlay, showMobileNav ? classes.showOverlay : null].join(" ")}
      onClick={bodyClickHandler}>
      <animated.div style={mobileSpring} className={[classes.DashboardNav, classes.mobile].join(" ")}>
        {content}
      </animated.div>
    </animated.div>
  ) : (
    <div className={classes.DashboardNav}>{content}</div>
  );

  return container;
};

export default DashboardNav;
