import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import classes from "./NavbarItems.module.css";
import { Link } from "react-router-dom";
import MobileNavItem from "../MobileNavItem/MobileNavItem";
import { navItems1, navItems2, mobileNavItems, loggedInNavItems, mobileLoggedinNavItems } from "./data";
import { useSelector } from "react-redux";

const NavbarItems = (props) => {
  const [navItems, setNavItems] = useState([]);
  const location = useLocation();
  const { loggedin } = useSelector((state) => state);

  useEffect(() => {
    if (props.PCType === "pages") {
      setNavItems(navItems1);
    }
    if (props.PCType === "login") {
      if (loggedin.status) {
        setNavItems(loggedInNavItems);
      } else {
        setNavItems(navItems2);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedin.status]);

  const content = props.mobile ? (
    loggedin.status ? (
      <div className={[classes.navBtns, classes.mobile].join(" ")}>
        {mobileLoggedinNavItems.map((item, index) => (
          <MobileNavItem key={index} text={item.text} url={item.url} icon={item.icon} active={location.pathname === item.url} />
        ))}
      </div>
    ) : (
      <div className={[classes.navBtns, classes.mobile].join(" ")}>
        {mobileNavItems.map((item, index) => (
          <MobileNavItem key={index} text={item.text} url={item.url} icon={item.icon} active={location.pathname === item.url} />
        ))}
      </div>
    )
  ) : (
    <div className={[classes.navBtns, classes.PCNavBtns].join(" ")}>
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.url}
          className={[
            location.pathname === item.url ? classes.active : null,
            item.type !== "standard" ? classes.toBtn : null,
            item.type === "login" ? classes.loginBtn : item.type === "signup" ? classes.signupBtn : null,
          ].join(" ")}>
          {item.text}
        </Link>
      ))}
    </div>
  );

  return content;
};

export default NavbarItems;
