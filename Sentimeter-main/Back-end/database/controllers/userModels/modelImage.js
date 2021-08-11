const { Model } = require("../../models/Model");
const path = require("path");
const fs = require("fs");

require("dotenv/config");

const DIR_PATH = path.join(__dirname, "..", "..", "..", "static", "images", "models");
const STATIC_PATH = `${process.env.SERVER_URL}/static/images/models/`;

const uploadImage = (req, res) => {
  if (req.body.files === null) return res.send({ success: false, msg: "No file is uploaded!" });
  const id = req.params.modelId;
  const image = req.files.image;
  const imageName = id + "." + image.name.split(".")[1];
  const imagePath = path.join(DIR_PATH, imageName);

  const files = fs.readdirSync(DIR_PATH);
  files.forEach((file) => {
    if (file.startsWith(id)) {
      fs.unlinkSync(path.join(DIR_PATH, file));
    }
  });
  image.mv(imagePath, (err) => {
    if (err) {
      res.send({ success: false, msg: "There was an error in moving the image", err: err });
    }
  });
  const imageURL = STATIC_PATH + imageName;
  Model.findByPk(id)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model found with this id." });
      model
        .update({ image: imageURL })
        .then(() => res.send({ success: true, msg: "Model image updated successfully!" }))
        .catch((err) => res.send({ success: false, msg: "Error while updating model image", err: err }));
    })
    .catch((err) => res.send({ success: false, msg: "Error while finding the model with the given id", err: err }));
};

const removeImage = (req, res) => {
  const id = req.params.modelId;
  const files = fs.readdirSync(DIR_PATH);
  files.forEach((file) => {
    if (file.startsWith(id)) {
      fs.unlinkSync(path.join(DIR_PATH, file));
    }
  });

  Model.findByPk(id)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model found with this id." });
      model
        .update({ image: null })
        .then(() => res.send({ success: true, msg: "Model image updated successfully!" }))
        .catch((err) => res.send({ success: false, msg: "Error while updating model image", err: err }));
    })
    .catch((err) => res.send({ success: false, msg: "Error while finding the model with the given id", err: err }));
};

module.exports = {
  uploadImage,
  removeImage,
};
