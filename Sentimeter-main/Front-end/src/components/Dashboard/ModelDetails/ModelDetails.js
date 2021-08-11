import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { config, useSpring, animated, useChain } from "react-spring";
import Loader from "../../../hoc/Loader/Loader";
import DeleteModel from "../DeleteModel/DeleteModel";
import classes from "./ModelDetails.module.css";

const ModelDetails = (props) => {
  const [isOwner, setIsOwner] = useState(false);
  const [update, setUpdate] = useState(false);
  const [model, setModel] = useState({});
  const [arch, setArch] = useState({});
  const [category, setCategory] = useState({});
  const [image, setImage] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const [nameEdit, setNameEdit] = useState(false);
  const [descriptionEdit, setDescriptionEdit] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  const [invalidDesc, setInvalidDesc] = useState(false);
  const [imageEdit, setImageEdit] = useState(false);
  const [saveImage, setSaveImage] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);

  const wrapperRef = useRef();
  const wrapperRefTwo = useRef();
  const modelRef = useRef();
  const nameInputRef = useRef();
  const descriptionInputRef = useRef();

  const { loggedin, screen } = useSelector((state) => state);

  const id = props.model.id;
  const axiosConfig = {
    headers: {
      Authorization: loggedin.token,
    },
  };

  const requestsHandler = () => {
    axios
      .all([axios.get(`/models/${id}`, axiosConfig), axios.get(`/models/isOwner/${id}`, axiosConfig)])
      .then((res) => {
        if (res[0].data.success) {
          setModel(res[0].data.data);
          axios
            .all([axios.get(`/models/arch/${res[0].data.data.arch_id}`, axiosConfig), axios.get(`/models/category/${res[0].data.data.cat_id}`, axiosConfig)])
            .then((resp) => {
              if (resp[0].data.success) {
                setArch(resp[0].data.data);
              } else {
                console.log(resp[0].data.msg);
              }

              if (resp[1].data.success) {
                setCategory(resp[1].data.data);
              } else {
                console.log(resp[1].data.msg);
              }
            })
            .catch((err) => console.log(err));
        } else {
          console.log(res[0].data.msg);
        }

        if (res[1].data.success) {
          if (res[1].data.data) {
            setIsOwner(true);
          } else {
            setIsOwner(false);
          }
        } else {
          console.log(res[1].data.msg);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (props.show) {
      requestsHandler();
    } else {
      props.update();
      setNameEdit(false);
      setDescriptionEdit(false);
      setImageEdit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.show]);

  useEffect(() => {
    if (model.name) nameInputRef.current.value = model.name;
    if (model.description) descriptionInputRef.current.value = model.description;
    if (model.image) setImage(model.image);
    if (model.image) setOriginalImage(model.image);
  }, [model]);

  useEffect(() => {
    if (props.updatedImage === "") {
      setImage(model.image);
    } else {
      setSaveImage(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(props.updatedImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.updatedImage]);

  useEffect(() => {
    if (update) {
      requestsHandler();
      setUpdate(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update]);

  const wrapperSpring = useSpring({
    ref: wrapperRef,
    from: {
      pointerEvents: "none",
      opacity: 0,
    },
    to: {
      pointerEvents: props.show ? "all" : "none",
      opacity: props.show ? 1 : 0,
    },
    config: config.default,
  });

  const modelSpring = useSpring({
    ref: modelRef,
    from: {
      opacity: 0,
      transform: "translateY(-20px)",
    },
    to: {
      transform: props.show ? "translateY(0)" : "translateY(-20px)",
      opacity: props.show ? 1 : 0,
    },
    config: config.gentle,
  });

  useChain(props.show ? [wrapperRef, modelRef] : [modelRef, wrapperRef], [0, 2]);

  const wrapperClichHandler = (e) => {
    e.preventDefault();
    if (e.target === wrapperRefTwo.current) {
      props.hideDetails();
    }
  };

  const nameUpdateHandler = () => {
    const name = nameInputRef.current.value;
    if (name.trim() !== "") {
      setInvalidName(false);
      axios
        .put(`models/${id}`, { name: name }, axiosConfig)
        .then((res) => {
          if (res.data.success) {
            setUpdate(true);
            setNameEdit(false);
          } else {
            console.log(res.data.msg);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setInvalidName(true);
    }
  };

  const descriptionUpdateHandler = () => {
    const desc = descriptionInputRef.current.value;
    if (desc.trim() !== "") {
      setInvalidDesc(false);
      axios
        .put(`models/${id}`, { description: desc }, axiosConfig)
        .then((res) => {
          if (res.data.success) {
            setUpdate(true);
            setDescriptionEdit(false);
          } else {
            console.log(res.data.msg);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setInvalidDesc(true);
    }
  };

  const updateImageHandler = () => {
    const formData = new FormData();
    formData.append("image", props.updatedImage);
    const imageConfig = {
      headers: {
        Authorization: loggedin.token,
        "Content-Type": "multipart/form-data",
      },
    };
    axios
      .post(`/models/image/${id}`, formData, imageConfig)
      .then((res) => {
        if (res.data.success) {
          props.update();
          setSaveImage(false);
          setImageEdit(false);
          setOriginalImage(image);
        } else {
          console.log(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
  };

  const removeImageHandler = () => {
    axios
      .delete(`/models/image/${id}`, axiosConfig)
      .then((res) => {
        if (res.data.success) {
          props.update();
          setUpdate(true);
          setImage("");
          setImageEdit(false);
        } else {
          console.log(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
  };

  const downloadModelClickHandler = () => {
    axios
      .get(`/models/files/${id}`, axiosConfig)
      .then((res) => {
        if (res.data.success) {
          window.open(res.data.path);
        } else {
          console.log(res.data.msg);
        }
      })
      .catch((err) => console.log(err));
  };

  const content = (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.name}>
          <h1>{model.name}</h1>
          {isOwner & (screen !== "Mobile") ? (
            <>
              {" "}
              <p className={classes.dot}>&middot;</p>
              <p className={classes.username}>
                Created by <Link to={`/dashboard/users/${model.user.username}`}>{model.user.username}</Link>
              </p>
            </>
          ) : null}
        </div>
        <i className={["fa fa-times", classes.xIcon].join(" ")} onClick={() => props.hideDetails()}></i>
      </div>
      <div className={classes.body}>
        <div className={classes.leftSide}>
          <div className={[classes.formGroup, isOwner ? classes.isOwner : null].join(" ")}>
            <p className={classes.groupName}>Status:</p>
            {model.ready ? (
              <p className={[classes.status, classes.readyStatus].join(" ")}>Ready</p>
            ) : model.training ? (
              <p className={[classes.status, classes.trainingStatus].join(" ")}>Training...</p>
            ) : (
              <p className={[classes.status, classes.notTrainedStatus].join(" ")}>Not trained yet</p>
            )}
          </div>
          <div className={[classes.formGroup, isOwner ? classes.isOwner : null].join(" ")}>
            <p className={classes.groupName}>Model name:</p>
            <input
              type="text"
              ref={nameInputRef}
              readOnly={!nameEdit}
              className={[isOwner ? classes.readOnlyInput : null, invalidName ? classes.invalid : null].join(" ")}
              placeholder="Model name"
            />
            {isOwner ? (
              nameEdit ? (
                <div className={[classes.editDiv, classes.saveDiv].join(" ")} onClick={nameUpdateHandler}>
                  <i className="fa fa-save"></i>
                  <p>Save</p>
                </div>
              ) : (
                <div className={classes.editDiv} onClick={() => setNameEdit(true)}>
                  <i className="fa fa-pen"></i>
                  <p>Edit</p>
                </div>
              )
            ) : null}
          </div>
          <div className={[classes.formGroup, classes.notToBeAligned, isOwner ? classes.isOwner : null].join(" ")}>
            <p className={classes.groupName}>Model Description:</p>
            <textarea
              type="text"
              ref={descriptionInputRef}
              rows={8}
              readOnly={!descriptionEdit}
              className={[isOwner ? classes.readOnlyInput : null, invalidDesc ? classes.invalid : null].join(" ")}
              placeholder="Model description"
            />
            {isOwner ? (
              descriptionEdit ? (
                <div className={[classes.editDiv, classes.saveDiv].join(" ")} onClick={descriptionUpdateHandler}>
                  <i className="fa fa-save"></i>
                  <p>Save</p>
                </div>
              ) : (
                <div className={classes.editDiv} onClick={() => setDescriptionEdit(true)}>
                  <i className="fa fa-pen"></i>
                  <p>Edit</p>
                </div>
              )
            ) : null}
          </div>
          <div className={[classes.formGroup, classes.notToBeAligned, isOwner ? classes.isOwner : null].join(" ")}>
            <p className={classes.groupName}>Model Image:</p>
            <img src={!image || image === "" ? "/images/modelNoImage.jpg" : image} alt="model_image" />
            {isOwner ? (
              imageEdit ? (
                <div className={classes.imageBtns}>
                  {!saveImage ? (
                    <div className={[classes.editDiv, classes.saveDiv, classes.uploadDiv].join(" ")} onClick={() => props.imageUpload()}>
                      <i className="fa fa-upload"></i>
                      <p>Upload</p>
                    </div>
                  ) : (
                    <div className={[classes.editDiv, classes.saveDiv, classes.uploadDiv].join(" ")} onClick={updateImageHandler}>
                      <i className="fa fa-upload"></i>
                      <p>save</p>
                    </div>
                  )}
                  <div className={[classes.editDiv, classes.removeDiv].join(" ")} onClick={removeImageHandler}>
                    <i className="fa fa-trash-alt"></i>
                    <p>Remove</p>
                  </div>
                  <div
                    className={[classes.editDiv, classes.cancelDiv].join(" ")}
                    onClick={() => {
                      setImage(originalImage);
                      setImageEdit(false);
                      setSaveImage(false);
                    }}>
                    <p>Cancel</p>
                  </div>
                </div>
              ) : (
                <div className={classes.editDiv} onClick={() => setImageEdit(true)}>
                  <i className="fa fa-pen"></i>
                  <p>Edit</p>
                </div>
              )
            ) : null}
          </div>
        </div>
        <div className={classes.rightSide}>
          <div className={[classes.rightFormGroup, isOwner ? classes.isOwner : null].join(" ")}>
            <h3 className={classes.groupName}>Model Archeticture:</h3>
            <div className={classes.dash}></div>
            <div className={classes.keyValuePair}>
              <p className={classes.key}>alias:</p>
              <p className={classes.value}>{arch.alias}</p>
            </div>
            <div className={classes.keyValuePair}>
              <p className={classes.key}>name:</p>
              <p className={classes.value}>{arch.name}</p>
            </div>
            <div className={classes.keyValuePair}>
              <p className={classes.key}>paper:</p>
              <p onClick={() => window.open(arch.paper, "_blank")} className={[classes.value, classes.archPaper].join(" ")}>
                {arch.paper}
              </p>
            </div>
          </div>
          <div className={[classes.rightFormGroup, isOwner ? classes.isOwner : null].join(" ")}>
            <h3 className={classes.groupName}>Model Category:</h3>
            <div className={classes.dash}></div>
            <div className={classes.keyValuePair}>
              <p className={classes.key}>name:</p>
              <p className={classes.value}>{category.category}</p>
            </div>
          </div>
          <div className={[classes.rightFormGroup, isOwner ? classes.isOwner : null].join(" ")}>
            <h3 className={classes.groupName}>Model Summary:</h3>
            <div className={classes.dash}></div>
            <div className={classes.keyValuePair}>
              <p className={classes.key}>likes:</p>
              <p className={classes.value}>{model.likes}</p>
            </div>
            <div className={classes.keyValuePair}>
              <p className={classes.key}>accuracy:</p>
              <p className={classes.value}>{model.accuracy === 0 ? "Not trained yet" : `${Math.round(model.accuracy * 100)}%`}</p>
            </div>
          </div>
        </div>
      </div>
      {model.ready || isOwner ? (
        <div className={classes.btnsContainer}>
          {isOwner ? (
            <button className={classes.deleteBtn} onClick={() => setDeleteModel(true)}>
              {screen !== "Mobile" ? <i className="fa fa-trash-alt"></i> : null} Delete Model
            </button>
          ) : null}
          {!model.ready ? (
            <div className={classes.downloadAndAPIBtns}>
              <button className={classes.downloadBtn} onClick={downloadModelClickHandler}>
                Dowload .h5 file
              </button>
              <Link className={classes.apiBtn} to={`/models/${model.id}/predict`}>
                Use predictions API
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  return (
    <animated.div style={wrapperSpring} ref={wrapperRefTwo} className={classes.modelWrapper} onClick={wrapperClichHandler}>
      <animated.div style={modelSpring} className={[classes.model, deleteModel ? classes.hide : classes.show].join(" ")}>
        <DeleteModel id={id} show={deleteModel} setShow={(e) => setDeleteModel(e)} />
        {!model ? <Loader transparent /> : content}
      </animated.div>
    </animated.div>
  );
};

export default ModelDetails;
