const { Model } = require("../../models/Model");
const ModelArch = require("../../models/ModelArch");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const predictVideo = (req, res) => {
  if (req.body.files === null) return res.send({ success: false, msg: "No file is uploaded!" });
  const id = req.params.modelId;
  const modelArch = null;
  Model.findByPk(id)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model is found with this id." });
      ModelArch.findByPk(model.arch_id)
        .then((arch) => {
          modelArch = arch.alias;
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

  const DIR_PATH = path.join(__dirname, "..", "..", "..", "static", "videos_predict");

  const files = fs.readdirSync(DIR_PATH);
  files.forEach((file) => {
    if (file.startsWith(id)) {
      fs.rmdirSync(path.join(DIR_PATH, file));
    }
  });

  const VIDEO_DIR_PATH = path.join(DIR_PATH, id);
  fs.mkdirSync(VIDEO_DIR_PATH);
  const video = req.files.video;
  if (video.name.split(".")[1] !== "mp4") return res.send({ success: false, msg: "Please upload .mp4 video file" });
  const videoName = "predict.mp4";
  const videoPath = path.join(VIDEO_DIR_PATH, videoName);

  video.mv(videoPath, (err) => {
    if (err) {
      res.send({ success: false, msg: "There was an error in moving the video", err: err });
    }
  });

  const flaskData = {
    model_id: id,
    model_arch: modelArch,
  };

  axios
    .post(`${process.env.FLASK_URL}/predict`, flaskData)
    .then((resp) => {
      res.send({ success: true, prediction: resp.presiction, msg: "Predicted successfully!" });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  predictVideo,
};
