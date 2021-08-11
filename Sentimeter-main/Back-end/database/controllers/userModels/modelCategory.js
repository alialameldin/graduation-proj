const ModelCategory = require("../../models/ModelCategory");
const Joi = require("joi");

const createModelCategory = (req, res) => {
  const validationError = validateModelCategory(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });
  ModelCategory.create({
    category: req.body.category,
  })
    .then(() => res.send({ success: true, msg: "Model category added successfully!" }))
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getModelCategories = (req, res) => {
  ModelCategory.findAll()
    .then((models) => {
      if (!models) return res.send({ success: false, msg: "There was an error." });
      if (models.length === 0) return res.send({ success: false, msg: "No models category found." });
      res.send({ success: true, data: models });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getOneModelCategory = (req, res) => {
  const id = req.params.id;
  ModelCategory.findByPk(+id)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model category found with this id." });
      res.send({ success: true, data: model });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const updateModelCategory = (req, res) => {
  const validationError = validateUpdateModelCategory(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });
  const id = req.params.id;
  ModelCategory.findByPk(+id)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model category found with this id." });
      model
        .update(req.body)
        .then(() => res.send({ success: true, data: model, msg: "Updated successfully!" }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const deleteModelCategory = (req, res) => {
  const id = req.params.id;
  ModelCategory.findByPk(+id)
    .then((model) => {
      if (!model) return res.send({ success: false, msg: "No model category found with this id." });
      model
        .destroy()
        .then(() => res.send({ success: true, data: model, msg: "Deleted successfully!" }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const validateModelCategory = (data) => {
  const schema = Joi.object({
    category: Joi.string().required(),
  });

  const { error } = schema.validate(data);
  return error;
};

const validateUpdateModelCategory = (data) => {
  const schema = Joi.object({
    category: Joi.string().optional(),
  });

  const { error } = schema.validate(data);
  return error;
};

module.exports = {
  getModelCategories,
  getOneModelCategory,
  createModelCategory,
  updateModelCategory,
  deleteModelCategory,
};
