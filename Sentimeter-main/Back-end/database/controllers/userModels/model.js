const { Model } = require("../../models/Model");
const User = require("../../models/User");
const Joi = require("joi");
const crypto = require("crypto");
const getIdFromToken = require("../../../lib/getIdFromToken");
const ModelArch = require("../../models/ModelArch");
const fs = require("fs");
const path = require("path");
const { validatePassword } = require("../../../lib/utils");

const MODELS_FILES_DIR_PATH = path.join(__dirname, "..", "..", "..", "static", "models_files");
const MODELS_IMAGES_DIR_PATH = path.join(__dirname, "..", "..", "..", "static", "images", "models");

const createModel = (req, res) => {
  const validationError = validateModel(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });
  const id = crypto.randomBytes(10).toString("hex");
  const userId = getIdFromToken(req.headers.authorization);
  console.log(req.body);
  Model.create({
    id: id,
    name: req.body.name,
    description: req.body.description,
    arch_id: req.body.archId,
    user_id: userId,
    cat_id: req.body.catId,
  })
    .then(() => {
      const filePath = path.join(MODELS_FILES_DIR_PATH, id);
      fs.mkdir(filePath, (err) => {
        if (err) {
          return console.error(err);
        }
        Model.findByPk(id)
          .then((model) => model.update({ filePath: filePath }))
          .catch((err) => console.log(err));
      });
      res.send({ success: true, msg: "Model created successfully!", id: id });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error creating the model.", error: err }));
};

const getAllModels = (req, res) => {
  Model.findAll({ include: { model: User, attributes: ["username"] }, order: [["createdAt", "DESC"]] })
    .then((models) => {
      if (!models) return res.send({ success: false, msg: "There was an error." });
      if (models.length === 0) return res.send({ success: false, msg: "No models found.", data: [] });
      res.send({ success: true, data: models });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getOneModel = (req, res) => {
  const id = req.params.id;
  Model.findOne({
    where: { id: id },
    include: [
      { model: User, attributes: ["username"] },
      { model: ModelArch, attributes: ["id", "name", "alias", "paper", "description"] },
    ],
  })
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model found with this id." });
      res.send({ success: true, data: model });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getUserModels = (req, res) => {
  const id = getIdFromToken(req.headers.authorization);
  Model.findAll({
    include: [
      {
        model: User,
        attributes: ["username"],
        where: {
          id: id,
        },
      },
    ],
    order: [["created_at", "DESC"]],
  })
    .then((models) => {
      if (!models) return res.send({ success: false, msg: "There was an error." });
      if (models.length === 0) return res.send({ success: false, msg: "You don't have any created models." });
      res.send({ success: true, data: models });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getOneUserModel = (req, res) => {
  const modelId = req.params.id;
  const userId = getIdFromToken(req.headers.authorization);
  Model.findByPk(modelId)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model found with this id." });
      if (userId !== model.user_id) return res.send({ success: false, msg: "You are not Authorized to get this model." });
      res.send({ success: true, data: model });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getIsModelOwner = (req, res) => {
  const modelId = req.params.id;
  const userId = getIdFromToken(req.headers.authorization);
  Model.findByPk(modelId)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model found with this id." });
      if (userId !== model.user_id) return res.send({ success: true, msg: "You are not the owner of this model.", data: false });
      res.send({ success: true, msg: "You are the owner of this model.", data: true });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const updateModel = (req, res) => {
  const validationError = validateUpdateModel(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });
  const modelId = req.params.id;
  const userId = getIdFromToken(req.headers.authorization);

  Model.findByPk(modelId)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model found with this id." });
      if (userId !== model.user_id) return res.send({ success: false, msg: "You are not Authorized to update this model." });
      model
        .update(req.body)
        .then(() => res.send({ success: true, data: model, msg: "Updated successfully!" }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const deleteModel = (req, res) => {
  const modelId = req.params.id;
  const userId = getIdFromToken(req.headers.authorization);

  const password = req.body.password;
  if (password === "" || !password) return res.send({ success: false, msg: "Wrong Password" });

  User.findByPk(userId)
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "No user found with this id." });
      Model.findByPk(modelId)
        .then((model) => {
          if (!model) return res.send({ success: false, msg: "No model found with this id." });
          if (userId !== model.user_id) return res.send({ success: false, msg: "You are not Authorized to delete this model." });
          const isValid = validatePassword(password, user.hash, user.salt);
          if (isValid) {
            model
              .destroy()
              .then(() => {
                const images = fs.readdirSync(MODELS_IMAGES_DIR_PATH);
                images.forEach((file) => {
                  if (file.startsWith(modelId)) {
                    fs.unlinkSync(path.join(MODELS_IMAGES_DIR_PATH, file));
                  }
                });
                removeDir(MODELS_FILES_DIR_PATH + "/" + modelId);
                res.send({ success: true, data: model, msg: "Deleted successfully!" });
              })
              .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
          } else {
            res.send({ success: false, msg: "Wrong Password" });
          }
        })
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const validateModel = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    archId: Joi.number().required(),
    catId: Joi.number().required(),
  });

  const { error } = schema.validate(data);
  return error;
};

const validateUpdateModel = (data) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    archId: Joi.number().optional(),
    catId: Joi.number().optional(),
  });

  const { error } = schema.validate(data);
  return error;
};

const removeDir = (path) => {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          removeDir(path + "/" + filename);
        } else {
          fs.unlinkSync(path + "/" + filename);
        }
      });
      fs.rmdirSync(path);
    } else {
      fs.rmdirSync(path);
    }
  } else {
    console.log("Directory path not found.");
  }
};

module.exports = {
  createModel,
  getAllModels,
  getUserModels,
  getOneUserModel,
  getIsModelOwner,
  getOneModel,
  updateModel,
  deleteModel,
};
