import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Navbar from "../../../containers/Dashboard/Navbar/Navbar";
import classes from "./AccountSettings.module.css";
import Notification from "../../../components/Dashboard/Notification/Notification";
import { setCurrentUser } from "../../../features/currentUserSlice";

const AccountSettings = (props) => {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [editFirstname, setEditFirstname] = useState(false);
  const [editLastname, setEditLastname] = useState(false);
  const [editUsername, setEditUsername] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [refreshData, setRefreshData] = useState(false);

  const { loggedin } = useSelector((state) => state);
  const currentUserDispatch = useDispatch();

  const axiosConfig = {
    headers: {
      authorization: loggedin.token,
    },
  };

  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();
  const imageRef = useRef();

  useEffect(() => {
    if (!loggedin.status) {
      history.replace("/login");
    } else {
      axios
        .get("/users/me", axiosConfig)
        .then((res) => {
          if (res.data.success) {
            const data = res.data.data;
            console.log(data.image);
            setUser(data);
          } else {
            console.log(res.data.msg);
          }
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refreshData) {
      axios
        .get("/users/me", axiosConfig)
        .then((res) => {
          if (res.data.success) {
            const data = res.data.data;
            const { username, firstname, lastname, email, image } = data;
            setUser(data);
            currentUserDispatch(setCurrentUser({ username, firstname, lastname, email, image }));
          } else {
            console.log(res.data.msg);
          }
        })
        .catch((err) => console.log(err));
      setRefreshData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshData]);

  const editClickHandler = (type) => {
    if (type === "firstname") {
      setEditFirstname(true);
    } else if (type === "lastname") {
      setEditLastname(true);
    } else if (type === "username") {
      setEditUsername(true);
    } else if (type === "email") {
      setEditEmail(true);
    }
  };

  const submitClickHandler = (type) => {
    const data = {};
    if (type === "firstname") {
      setEditFirstname(false);
      data.firstname = firstnameRef.current.value;
    } else if (type === "lastname") {
      setEditLastname(false);
      data.lastname = lastnameRef.current.value;
    } else if (type === "username") {
      setEditUsername(false);
      data.username = usernameRef.current.value;
    } else if (type === "email") {
      setEditEmail(false);
      data.email = emailRef.current.value;
    }

    axios
      .put(`/users/me`, data, axiosConfig)
      .then((res) => {
        setNotificationMsg(res.data.msg);
        setShowNotification(true);
        if (res.data.success) {
          setRefreshData(true);
        }
      })
      .catch((err) => console.log(err));
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const changePasswordHandler = () => {
    const data = {
      password: currentPasswordRef.current.value,
      newPassword: newPasswordRef.current.value,
      confirmPassword: confirmNewPasswordRef.current.value,
    };

    axios
      .post("/users/password/change", data, axiosConfig)
      .then((res) => {
        setNotificationMsg(res.data.msg);
        setShowNotification(true);
        currentPasswordRef.current.value = "";
        newPasswordRef.current.value = "";
        confirmNewPasswordRef.current.value = "";
      })
      .catch((err) => console.log(err));
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const inputChangeHandler = (e, type) => {
    e.preventDefault();
    if (type === "firstname") {
      firstnameRef.current.value = e.target.value;
    } else if (type === "lastname") {
      lastnameRef.current.value = e.target.value;
    } else if (type === "username") {
      usernameRef.current.value = e.target.value;
    } else if (type === "email") {
      emailRef.current.value = e.target.value;
    }
  };

  const imageUploaderHandler = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      imageRef.current.setAttribute("src", event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    axios
      .post("users/image/change", formData, axiosConfig)
      .then((res) => {
        setNotificationMsg(res.data.msg);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      })
      .catch((err) => console.log(err));
  };

  const imageRemovalHandler = (e) => {
    imageRef.current.setAttribute("src", "/images/userImageNotFound.jpg");
    axios
      .delete("users/image/remove", axiosConfig)
      .then((res) => {
        setNotificationMsg(res.data.msg);
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.AccountSettings}>
      <Navbar />
      <div className={classes.container}>
        <div className={classes.formGroup}>
          <h1 className={classes.formGroupName}>Firstname:</h1>
          <input
            className={editFirstname ? classes.editable : null}
            type="text"
            ref={firstnameRef}
            defaultValue={user.firstname}
            onChange={(e) => inputChangeHandler(e, "firstname")}
            readOnly={!editFirstname}
          />
          {!editFirstname ? (
            <button className={classes.editBtn} onClick={() => editClickHandler("firstname")}>
              Edit
            </button>
          ) : (
            <button className={classes.editBtn} onClick={() => submitClickHandler("firstname")}>
              Save
            </button>
          )}
        </div>
        <div className={classes.formGroup}>
          <h1 className={classes.formGroupName}>Lastname:</h1>
          <input className={editLastname ? classes.editable : null} type="text" ref={lastnameRef} defaultValue={user.lastname} readOnly={!editLastname} />
          {!editLastname ? (
            <button className={classes.editBtn} onClick={() => editClickHandler("lastname")}>
              Edit
            </button>
          ) : (
            <button className={classes.editBtn} onClick={() => submitClickHandler("lastname")}>
              Save
            </button>
          )}
        </div>
        <div className={classes.formGroup}>
          <h1 className={classes.formGroupName}>Username:</h1>
          <input className={editUsername ? classes.editable : null} type="text" ref={usernameRef} defaultValue={user.username} readOnly={!editUsername} />
          {!editUsername ? (
            <button className={classes.editBtn} onClick={() => editClickHandler("username")}>
              Edit
            </button>
          ) : (
            <button className={classes.editBtn} onClick={() => submitClickHandler("username")}>
              Save
            </button>
          )}
        </div>
        <div className={classes.formGroup}>
          <h1 className={classes.formGroupName}>Email:</h1>
          <input className={editEmail ? classes.editable : null} type="text" ref={emailRef} defaultValue={user.email} readOnly={!editEmail} />
          {!editEmail ? (
            <button className={classes.editBtn} onClick={() => editClickHandler("email")}>
              Edit
            </button>
          ) : (
            <button className={classes.editBtn} onClick={() => submitClickHandler("email")}>
              Save
            </button>
          )}
        </div>
        <div className={classes.formGroup}>
          <h1 className={classes.formGroupName}>Password:</h1>
          <div className={classes.passwordInputs}>
            <input name="Password" type="password" ref={currentPasswordRef} placeholder="Current Password" />
            <input name="NewPassword" type="password" ref={newPasswordRef} placeholder="New Password" />
            <input name="ConfirmNewPassword" type="password" ref={confirmNewPasswordRef} placeholder="Confirm New Password" />
          </div>
          <button className={classes.editBtn} onClick={changePasswordHandler}>
            Save
          </button>
        </div>
        <div className={classes.formGroup}>
          <h1 className={classes.formGroupName}>Image:</h1>
          <img src={user.image ? user.image : "/images/userImageNotFound.jpg"} ref={imageRef} alt="user_image" />
          <div className={classes.imageBtns}>
            <div className={classes.imageUploadInput}>
              <input type="file" onChange={imageUploaderHandler} />
              <button className={classes.editBtn}>Upload</button>
            </div>
            <button className={[classes.editBtn, classes.removeBtn].join(" ")} onClick={imageRemovalHandler}>
              Remove
            </button>
          </div>
        </div>
      </div>
      {showNotification ? <Notification>{notificationMsg}</Notification> : null}
    </div>
  );
};

export default AccountSettings;
