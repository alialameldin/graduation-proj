import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classes from "./Layout.module.css";

const Layout = (props) => {
  const { screen } = useSelector((state) => state);
  const [isMobile, setMobile] = useState(false);
  useEffect(() => {
    if (screen === "Mobile") {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [screen]);

  return <div className={[classes.Layout, isMobile ? classes.mobile : null].join(" ")}>{props.children}</div>;
};

export default Layout;
