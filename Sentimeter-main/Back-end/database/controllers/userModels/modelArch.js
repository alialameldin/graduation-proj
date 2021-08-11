const ModelArch = require("../../models/ModelArch");
const Joi = require("joi");

const createModelArch = (req, res) => {
  const validationError = validateModelArch(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });
  ModelArch.create({
    name: req.body.name,
    alias: req.body.alias,
    description: req.body.description,
    paper: req.body.paper,
  })
    .then(() => res.send({ success: true, msg: "Model archeticture added successfully!" }))
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getModelArchs = (req, res) => {
  ModelArch.findAll()
    .then((models) => {
      if (!models) return res.send({ success: false, msg: "There was an error." });
      if (models.length === 0) return res.send({ success: false, msg: "No models archeticture found." });
      res.send({ success: true, data: models });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getOneModelArch = (req, res) => {
  const id = req.params.id;
  ModelArch.findByPk(+id)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model archeticture found with this id." });
      res.send({ success: true, data: model });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const updateModelArch = (req, res) => {
  const validationError = validateUpdateModelArch(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });
  const id = req.params.id;
  ModelArch.findByPk(+id)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model archeticture found with this id." });
      model
        .update(req.body)
        .then(() => res.send({ success: true, data: model, msg: "Updated successfully!" }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const deleteModelArch = (req, res) => {
  const id = req.params.id;
  ModelArch.findByPk(+id)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model archeticture found with this id." });
      model
        .destroy()
        .then(() => res.send({ success: true, data: model, msg: "Deleted successfully!" }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const validateModelArch = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    alias: Joi.string().required(),
    description: Joi.string().required(),
    paper: Joi.string().required(),
  });

  const { error } = schema.validate(data);
  return error;
};

const validateUpdateModelArch = (data) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    alias: Joi.string().optional(),
    description: Joi.string().optional(),
    paper: Joi.string().optional(),
  });

  const { error } = schema.validate(data);
  return error;
};

module.exports = {
  getModelArchs,
  getOneModelArch,
  createModelArch,
  updateModelArch,
  deleteModelArch,
};
