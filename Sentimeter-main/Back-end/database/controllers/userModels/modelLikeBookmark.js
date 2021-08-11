const { LikedModels, BookmarkedModels, Model } = require("../../models/Model");
const User = require("../../models/User");
const db = require("../../config");
const Joi = require("joi");
const crypto = require("crypto");
const getIdFromToken = require("../../../lib/getIdFromToken");

const likeModel = (req, res) => {
  const userId = getIdFromToken(req.headers.authorization);
  const modelId = req.body.modelId;
  Model.findByPk(modelId)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model found with this id." });
      LikedModels.create({
        uid: userId,
        mid: modelId,
      })
        .then(() => res.send({ success: true, msg: "Model added successfully!" }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
      model
        .update({ likes: model.likes + 1 })
        .then()
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const unlikeModel = (req, res) => {
  const userId = getIdFromToken(req.headers.authorization);
  const modelId = req.body.modelId;
  LikedModels.findOne({ where: { mid: modelId, uid: userId } })
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model found with this id." });
      model
        .destroy()
        .then()
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
      Model.findByPk(modelId)
        .then((m) =>
          m
            .update({ likes: m.likes - 1 })
            .then()
            .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }))
        )
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
      res.send({ success: true, msg: "Model is unliked!" });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const bookmarkModel = (req, res) => {
  const userId = getIdFromToken(req.headers.authorization);
  const modelId = req.body.modelId;
  Model.findByPk(modelId)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model found with this id." });
      BookmarkedModels.create({
        uid: userId,
        mid: modelId,
      })
        .then(() => res.send({ success: true, msg: "Model added successfully!" }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const unbookmarkModel = (req, res) => {
  const userId = getIdFromToken(req.headers.authorization);
  const modelId = req.body.modelId;
  BookmarkedModels.findOne({ where: { mid: modelId, uid: userId } })
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model found with this id." });
      model
        .destroy()
        .then()
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
      res.send({ success: true, msg: "Model is unbookmarked!" });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getUserLikes = (req, res) => {
  const userId = getIdFromToken(req.headers.authorization);
  db.query(`SELECT * FROM liked_models LEFT JOIN models ON liked_models.mid = models.id WHERE uid = '${userId}' ORDER BY liked_models.created_at DESC;`)
    .then((models) => {
      const data = models[0];
      User.findByPk(userId)
        .then((user) => {
          data.map((item) => {
            item.user = {};
            item.user.username = user.username;
          });
          res.send({ success: true, data: data });
        })
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getModelLikes = (req, res) => {
  const modelId = req.params.id;
  Model.findOne({ where: { id: modelId } })
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "Model not found!" });
      res.send({ success: true, data: model.likes });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getUserBookmarks = (req, res) => {
  const userId = getIdFromToken(req.headers.authorization);
  db.query(
    `SELECT * FROM bookmarked_models LEFT JOIN models ON bookmarked_models.mid = models.id WHERE uid = '${userId}' ORDER BY bookmarked_models.created_at DESC;`
  )
    .then((models) => {
      const data = models[0];
      User.findByPk(userId)
        .then((user) => {
          data.forEach((item) => {
            item.user = {};
            item.user.username = user.username;
          });
          res.send({ success: true, data: data });
        })
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getLikedModelsId = (req, res) => {
  const userId = getIdFromToken(req.headers.authorization);
  LikedModels.findAll({ where: { uid: userId } })
    .then((models) => {
      if (!models) return res.send({ success: false, msg: "There was an error." });
      if (models.length === 0) return res.send({ success: false, msg: "No models found." });
      const arr = [];
      models.forEach((model) => {
        arr.push(model.mid);
      });
      res.send({ success: true, data: arr });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getBookmarkedModelsId = (req, res) => {
  const userId = getIdFromToken(req.headers.authorization);
  BookmarkedModels.findAll({ where: { uid: userId } })
    .then((models) => {
      if (!models) return res.send({ success: false, msg: "There was an error." });
      if (models.length === 0) return res.send({ success: false, msg: "No models found." });
      const arr = [];
      models.forEach((model) => {
        arr.push(model.mid);
      });
      res.send({ success: true, data: arr });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

module.exports = {
  likeModel,
  unlikeModel,
  bookmarkModel,
  unbookmarkModel,
  getUserBookmarks,
  getUserLikes,
  getLikedModelsId,
  getBookmarkedModelsId,
  getModelLikes,
};
