import React, { useEffect, useState } from "react";
import classes from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSpring, animated, config } from "react-spring";
import NavbarItems from "../../../components/Homepage/NavbarItems/NavbarItems";

const Navbar = (props) => {
  const [isMobile, setMobile] = useState(false);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const { screen } = useSelector((state) => state);

  useEffect(() => {
    if (screen === "Mobile") {
      setMobile(true);
    } else {
      setMobile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  useEffect(() => {
    if (!isMobile) {
      setMobileNavOpen(false);
    }
  }, [isMobile]);

  const mobileNavFadeIn = useSpring({
    config: config.default,
    from: {
      transform: "translateX(-100%)",
    },
    to: {
      transform: isMobileNavOpen ? "translateX(0)" : "translateX(-100%)",
    },
  });

  const hamburgerMenuClickHandler = () => {
    setMobileNavOpen(!isMobileNavOpen);
  };

  const hamburgerMenu = (
    <div className={classes.hamburger} onClick={hamburgerMenuClickHandler}>
      <i className={`fas fa-${isMobileNavOpen ? "times" : "bars"}`}></i>
    </div>
  );

  return (
    <div className={[classes.Navbar, isMobile ? classes.mobileNav : null].join(" ")}>
      <div className={classes.container}>
        <div className={classes.leftSide}>
          <div className={classes.logoContainer}>
            <Link to="/">
              <img src="/images/logo.png" alt="logo" className={classes.logo} />
            </Link>
          </div>
          {!isMobile ? <NavbarItems PCType="pages" /> : null}
        </div>
        <div className={classes.rightSide}>
          {isMobile ? hamburgerMenu : <NavbarItems PCType="login" />}
          {isMobileNavOpen ? <div className={classes.blackOverlay} onClick={() => setMobileNavOpen(false)}></div> : null}
          <animated.div className={classes.mobileNavBtnsContainer} style={mobileNavFadeIn}>
            <NavbarItems mobile />
          </animated.div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
