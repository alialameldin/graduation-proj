const User = require("../../models/User");
const path = require("path");
const getIdFromToken = require("../../../lib/getIdFromToken");
const fs = require("fs");

require("dotenv/config");

const STATIC_PATH = path.join(__dirname, "..", "..", "..", "static", "images", "users");
const IMAGE_PATH = `${process.env.SERVER_URL}/static/images/users`;

const uploadImage = (req, res) => {
  if (req.body.files === null) return res.send({ success: false, msg: "No file is uploaded!" });
  const id = getIdFromToken(req.headers.authorization);
  const image = req.files.image;
  const imageName = id + "." + image.name.split(".")[1];
  const imagePath = path.join(STATIC_PATH, imageName);
  const imagePathDB = IMAGE_PATH + "/" + imageName;

  const files = fs.readdirSync(STATIC_PATH);
  files.forEach((file) => {
    if (file.startsWith(id)) {
      fs.unlinkSync(path.join(STATIC_PATH, file));
    }
  });
  image.mv(imagePath, (err) => {
    if (err) {
      res.send({ success: false, msg: "There was an error in moving the image", err: err });
    }
  });
  User.findByPk(id)
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "No user found with this id." });
      user
        .update({ image: imagePathDB })
        .then(() => res.send({ success: true, msg: "Image updated successfully!" }))
        .catch((err) => res.send({ success: false, msg: "Error while updating model image", err: err }));
    })
    .catch((err) => res.send({ success: false, msg: "Error while finding user with the given id", err: err }));
};

const removeImage = (req, res) => {
  const id = getIdFromToken(req.headers.authorization);
  const files = fs.readdirSync(STATIC_PATH);
  files.forEach((file) => {
    if (file.startsWith(id)) {
      fs.unlinkSync(path.join(STATIC_PATH, file));
    }
  });

  User.findByPk(id)
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "No user found with this id." });
      user
        .update({ image: null })
        .then(() => res.send({ success: true, msg: "Image deleted successfully!" }))
        .catch((err) => res.send({ success: false, msg: "Error while updating model image", err: err }));
    })
    .catch((err) => res.send({ success: false, msg: "Error while finding user with the given id", err: err }));
};

module.exports = {
  uploadImage,
  removeImage,
};
