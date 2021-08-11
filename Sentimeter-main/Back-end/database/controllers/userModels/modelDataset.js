const { Model } = require("../../models/Model");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
require("dotenv/config");

const DATA_PATH = path.join(__dirname, "..", "..", "..", "static", "data");

const uploadDataset = (req, res) => {
  if (req.body.files === null) return res.send({ success: false, msg: "No dataset uploaded!" });
  const id = req.params.modelId;
  const dataset = req.files.dataset;
  const model_arch = req.files.arch;
  const dataset_path = path.join(DATA_PATH, id);
  const video_path = path.join(dataset_path, "Video");
  const audio_path = path.join(dataset_path, "Audio");
  const text_path = path.join(dataset_path, "Text");
  if (!fs.existsSync(dataset_path)) {
    fs.mkdirSync(dataset_path, { recursive: true });
    fs.mkdirSync(video_path, { recursive: true });
    fs.mkdirSync(audio_path, { recursive: true });
    fs.mkdirSync(text_path, { recursive: true });
  }
  dataset.forEach((data) => {
    if (data.name.endsWith("mp4")) {
      data.mv(video_path + "/" + data.name);
    }
    if (data.name.endsWith("wav")) {
      data.mv(audio_path + "/" + data.name);
    }
    if (data.name.endsWith("txt")) {
      data.mv(text_path + "/" + data.name);
    }
    if (data.name.endsWith("csv")) {
      data.mv(dataset_path + "/" + data.name);
    }
  });
  const videosUploaded = fs.readdirSync(video_path);
  const audioUploaded = fs.readdirSync(audio_path);
  const textUploaded = fs.readdirSync(text_path);
  const filesNum = videosUploaded.length + audioUploaded.length + textUploaded.length;

  const flaskData = {
    model_id: id,
    model_arch: model_arch,
  };
  axios
    .post(`${process.env.FLASK_URL}/create_model`, flaskData)
    .then()
    .catch((err) => console.log(err));

  res.send({ success: true, msg: "Dataset created successfully!", num: filesNum });
};

module.exports = {
  uploadDataset,
};
