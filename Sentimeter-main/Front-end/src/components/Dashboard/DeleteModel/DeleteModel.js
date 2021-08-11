import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useSpring, config, animated } from "react-spring";
import classes from "./DeleteModel.module.css";

const DeleteModel = (props) => {
  const [password, setPassword] = useState("");
  const [wrongPassword, setWrongPassword] = useState(false);

  const history = useHistory();
  const { loggedin } = useSelector((state) => state);

  useEffect(() => {
    if (wrongPassword && password !== "") {
      setWrongPassword(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  const axiosConfig = {
    headers: {
      Authorization: loggedin.token,
    },
  };

  const showSpring = useSpring({
    from: {
      opacity: 0,
      pointerEvents: "none",
      transform: "translate(-50%, -2rem)",
    },
    to: {
      opacity: props.show ? 1 : 0,
      pointerEvents: props.show ? "all" : "none",
      transform: props.show ? "translate(-50%, 0)" : "translate(-50%, -2rem)",
    },
    config: config.gentle,
  });

  const cancelClickHandler = () => props.setShow(false);
  const deleteClickHandler = () => {
    if (password === "") {
      setWrongPassword(true);
      return;
    }
    axios.post(`/models/delete/${props.id}`, { password: password }, axiosConfig).then((res) => {
      if (res.data.success) {
        history.go();
      } else if (res.data.msg === "Wrong Password") {
        setWrongPassword(true);
      } else {
        console.log(res.data.msg);
      }
    });
  };
  return (
    <animated.div style={showSpring} className={classes.DeleteModel}>
      <div className={classes.body}>
        <h3>Delete your model</h3>
        <p className={classes.text}>You are about to delete your model permenantly. This step is irreversible.</p>
        <div className={classes.inputContainer}>
          <label htmlFor="">Your password:</label>
          <input
            type="password"
            className={[classes.passwordInput, wrongPassword ? classes.alertInput : null].join(" ")}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {wrongPassword ? <p className={classes.error}>You have entered incorrect password.</p> : null}
      </div>
      <div className={classes.btnsContainer}>
        <button className={classes.deleteBtn} onClick={deleteClickHandler}>
          Delete Model
        </button>
        <button className={classes.cancelBtn} onClick={cancelClickHandler}>
          Cancel
        </button>
      </div>
    </animated.div>
  );
};

export default DeleteModel;
