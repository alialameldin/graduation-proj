import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PageTitle from "../../../components/Dashboard/PageTitle/PageTitle";
import classes from "./CreateModel.module.css";
import { useSpring, animated, config } from "react-spring";
import { Link, useHistory } from "react-router-dom";
import Notification from "../../../components/Dashboard/Notification/Notification";
import ProgressBar from "@ramonak/react-progress-bar";

const CreateModel = (props) => {
  const [modelArchs, setModelArchs] = useState([]);
  const [selectedArch, setSelectedArch] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedImage, setSelectedImage] = useState(false);
  const [refreshCats, setRefreshCats] = useState(true);
  const [modelCats, setModelCats] = useState([]);
  const [paperLinkHref, setPaperLinkHref] = useState("");
  const [addACategory, setAddACategory] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [datasetPath, setDatasetPath] = useState(false);
  const [emptyName, setEmptyName] = useState(false);
  const [emptyDatasetPath, setEmptyDatasetPath] = useState(false);
  const [notification, setNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [datasetProgress, setDatasetProgress] = useState(0);

  const { loggedin } = useSelector((state) => state);

  const newCategoryRef = useRef();
  const imagePreviewRef = useRef();
  const history = useHistory();

  const axiosConfig = {
    headers: {
      Authorization: loggedin.token,
    },
  };

  useEffect(() => {
    axios
      .get("/models/arch", axiosConfig)
      .then((res) => {
        if (res.data.success) {
          setModelArchs(res.data.data);
        } else {
          console.log(res.data.msg);
        }
      })
      .catch((err) => console.log(err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refreshCats) {
      axios
        .get("/models/category", axiosConfig)
        .then((res) => {
          if (res.data.success) {
            setModelCats(res.data.data);
            setRefreshCats(false);
          } else {
            console.log(res.data.msg);
          }
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCats]);

  useEffect(() => {
    if (modelArchs.length > 0) {
      setSelectedArch(modelArchs[0].id);
      setPaperLinkHref(modelArchs[0].paper);
    }

    if (modelCats.length > 0) {
      setSelectedCategory(modelCats[0].id);
    }
  }, [modelArchs, modelCats]);

  const addCategorySpring = useSpring({
    from: {
      opacity: 0,
      display: "none",
    },
    to: {
      opacity: addACategory ? 1 : 0,
      display: addACategory ? "grid" : "none",
    },
    config: config.default,
  });

  const archSelectHandler = (e) => {
    const selected = modelArchs.find((item) => item.alias === e.target.value);
    setSelectedArch(selected.id);
    setPaperLinkHref(selected.paper);
  };

  const categorySelectHandler = (e) => {
    setSelectedCategory(parseInt(e.target.value));
  };

  const addCategoryHandler = () => {
    const text = newCategoryRef.current.value.trim();
    const modelCategories = [];
    modelCats.map((item) => modelCategories.push(item.category.toLowerCase()));
    if (!modelCategories.includes(text.toLowerCase())) {
      axios
        .post("/models/category", { category: text }, axiosConfig)
        .then((res) => {
          if (res.data.success) {
            setRefreshCats(true);
            newCategoryRef.current.value = "";
            setAddACategory(false);
          } else {
            console.log(res.data.msg);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    if (name !== "" && emptyName) {
      setEmptyName(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    if (datasetPath !== null && emptyDatasetPath) {
      setEmptyDatasetPath(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetPath]);

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(false);
      }, 4000);
    }
  }, [notification]);

  const uploadImageHandler = (e) => {
    setSelectedImage(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreviewRef.current.setAttribute("src", event.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const submitClickHandler = () => {
    if (name === "" || datasetPath === false) {
      if (name === "") setEmptyName(true);
      if (datasetPath === false) setEmptyDatasetPath(true);
      setNotification(true);
      setNotificationMsg("Please fill the required fields.");
      return;
    }

    const datasetFormData = new FormData();
    datasetPath.forEach((data) => {
      datasetFormData.append("dataset", data);
    });
    const modelArch = modelArchs.filter((item) => item.id === selectedArch);
    datasetFormData.append("arch", modelArch[0].alias);
    const imageFormData = new FormData();
    imageFormData.append("image", selectedImage);

    const imageFormConfig = {
      headers: {
        Authorization: loggedin.token,
        "Content-Type": "multipart/form-data",
      },
    };
    const datasetFormConfig = {
      headers: {
        Authorization: loggedin.token,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setDatasetProgress(percentCompleted);
      },
    };
    const data = {
      name: name,
      catId: selectedCategory,
      archId: selectedArch,
    };

    if (description !== "") {
      data.description = description;
    }

    axios
      .post("/models/create", data, axiosConfig)
      .then((res) => {
        if (res.data.success) {
          if (selectedImage) {
            axios
              .post(`/models/image/${res.data.id}`, imageFormData, imageFormConfig)
              .then((res) => {
                if (!res.data.success) {
                  setNotificationMsg(res.data.msg);
                  setNotification(true);
                }
              })
              .catch((err) => console.log(err));
          }
          axios
            .post(`/models/dataset/${res.data.id}`, datasetFormData, datasetFormConfig)
            .then((res) => {
              if (res.data.success) {
                setNotificationMsg(`Model created successfully! You will be redirected to My Models page after 3 seconds.`);
                setNotification(true);
                setTimeout(() => {
                  history.push("/dashboard/my_models");
                }, 3000);
              } else {
                setNotificationMsg(res.data.msg);
                setNotification(true);
              }
            })
            .catch((err) => console.log(err));
        } else {
          setNotificationMsg(res.data.msg);
          setNotification(true);
          console.log(res.data.error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.CreateModel}>
      <PageTitle>Create a model</PageTitle>
      <div className={classes.container}>
        <div className={classes.leftSide}>
          <div className={classes.formGroup}>
            <label htmlFor="name">
              Model Name<span className={classes.starIcon}>*</span>
            </label>
            <input type="text" className={emptyName ? classes.empty : null} name="name" placeholder="Name" onChange={(e) => setName(e.target.value.trim())} />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="description">Model Description</label>
            <textarea type="text" name="description" rows={6} placeholder="Description" onChange={(e) => setDescription(e.target.value.trim())} />
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="archeticture">
              Model Archeticture<span className={classes.starIcon}>*</span>
            </label>
            <select className={classes.modelSelect} onChange={archSelectHandler}>
              {modelArchs.map((arch, index) => (
                <option key={index} value={arch.alias}>
                  {arch.alias} - {arch.name}
                </option>
              ))}
            </select>
            <a href={paperLinkHref} target="blank" className={classes.paperLink}>
              Need to know more about this archeticture? click here to view the paper.
            </a>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="category">
              Model Category<span className={classes.starIcon}>*</span>
            </label>
            <select className={classes.modelSelect} onChange={categorySelectHandler}>
              {modelCats.map((cat, index) => (
                <option key={index} value={cat.id}>
                  {cat.category}
                </option>
              ))}
            </select>
            <div className={classes.addCategorytextContainer}>
              <p className={classes.addCategorytext} onClick={() => setAddACategory(!addACategory)}>
                {!addACategory ? "+ Add a new category" : "Cancel"}
              </p>
            </div>
            <animated.div style={addCategorySpring} className={classes.addCategoryDiv}>
              <input ref={newCategoryRef} type="text" placeholder="New Category" />
              <button className={classes.addCategoryBtn} onClick={addCategoryHandler}>
                Add
              </button>
            </animated.div>
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="dataset">
              <i className="fab fa-google-drive"></i> Dataset Path<span className={classes.starIcon}>*</span>
            </label>
            <input
              type="file"
              className={emptyDatasetPath ? classes.empty : null}
              webkitdirectory=""
              directory=""
              name="dataset"
              placeholder="Dataset Path"
              onChange={(e) => setDatasetPath([...e.target.files])}
            />
            <Link to="/dashboard/getting_started" className={classes.paperLink}>
              Don't know how to upload the dataset? click here to learn how to prepare and upload it.
            </Link>
          </div>
        </div>
        <div className={classes.rightSide}>
          <div className={[classes.formGroup, classes.imageUploader].join(" ")}>
            <label htmlFor="image">Model Image</label>
            <div className={classes.imageUploaderInput}>
              <p>
                <i className="fas fa-cloud-upload-alt"></i> Upload image
              </p>
              <input type="file" name="image" accept="image/*" multiple={false} placeholder="Name" onChange={uploadImageHandler} />
            </div>
            <div className={classes.imagePreview}>
              {selectedImage ? <p>Selected image:</p> : <p className={classes.noSelectedImage}>No selected Image</p>}
              {selectedImage ? (
                <div>
                  <img ref={imagePreviewRef} src="" alt="" />
                  <p className={classes.removeSelectedImage} onClick={() => setSelectedImage(false)}>
                    <i className="fa fa-trash-alt"></i> remove
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.submitBtnContainer}>
        <div className={classes.uploadProgress}>
          <p>Upload progress:</p>
          <ProgressBar className={classes.progressbar} completed={datasetProgress} bgColor="#4f97c7" labelColor="#1a3f66" transitionDuration="1s" />
        </div>
        <button className={classes.submitBtn} onClick={submitClickHandler}>
          Create model
        </button>
      </div>
      {notification ? <Notification>{notificationMsg}</Notification> : null}
    </div>
  );
};

export default CreateModel;
