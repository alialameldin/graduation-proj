import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMobileDashNavOpen } from "../../../features/mobileDashNavSlice";
import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";

const Navbar = (props) => {
  const [isMyAccountOpen, setMyAccountOpen] = useState(null);
  const [isMobile, setMobile] = useState(false);

  const { screen, isMobileDashNavOpen, currentUser } = useSelector((state) => state);
  const mobileDashNavDispatch = useDispatch(setMobileDashNavOpen);

  const accListRef = useRef();
  const accBtnRef = useRef();

  useEffect(() => {
    if (screen === "Mobile") {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [screen]);

  const myAccountClickHandler = () => {
    setMyAccountOpen(!isMyAccountOpen);
  };

  const hamburgerClickHandler = () => {
    mobileDashNavDispatch(setMobileDashNavOpen(!isMobileDashNavOpen));
  };

  return (
    <div className={classes.Navbar}>
      <div className={classes.container}>
        {isMobile ? (
          <div className={classes.hamburgerIcon} onClick={hamburgerClickHandler}>
            <i className="fas fa-bars"></i>
          </div>
        ) : null}
        <div className={classes.logoContainer}>
          <Link to="/" className={classes.logo}>
            <img src="/images/logo.png" alt="logo" />
          </Link>
        </div>
        <div className={classes.myAccount}>
          {isMobile ? (
            <button ref={accBtnRef} className={[classes.myAccountBtn, classes.mobileIcon].join(" ")} onClick={myAccountClickHandler}>
              <i className="fas fa-ellipsis-v"></i>
            </button>
          ) : (
            <button ref={accBtnRef} className={classes.myAccountBtn} onClick={myAccountClickHandler}>
              My Account <i className={`fa fa-chevron-${isMyAccountOpen ? "up" : "down"}`}></i>
            </button>
          )}
          <ul
            ref={accListRef}
            className={[classes.myAccountList, isMyAccountOpen ? classes.shown : isMyAccountOpen === false ? classes.hidden : null].join(" ")}>
            <li>
              <Link to={`/users/${currentUser.username}`}>
                <i className="fa fa-user"></i>My Profile
              </Link>
            </li>
            <li>
              <Link to="/account_settings">
                <i className="fa fa-cog"></i>Account Settings
              </Link>
            </li>
            <li>
              <Link to="/logout">
                <i className="fa fa-sign-out-alt"></i>Log Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
