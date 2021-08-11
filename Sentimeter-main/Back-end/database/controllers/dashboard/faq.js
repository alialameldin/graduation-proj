const Question = require("../../models/Question");
const Joi = require("joi");

const getAllQuestions = (req, res) => {
  Question.findAll({ order: [["created_at", "ASC"]] })
    .then((questions) => res.send({ success: true, data: questions }))
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const postQuestion = (req, res) => {
  const error = validateQuestion(req.body);
  if (error) return res.send({ success: false, msg: error.details[0].message });

  Question.create({
    question: req.body.question,
    answer: req.body.answer,
  })
    .then((resp) => res.send({ success: true, msg: "Question added!" }))
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const updateQuestion = (req, res) => {
  const id = req.params.id;
  const error = validatePUTFAQ(req.body);
  if (error) return res.send({ success: false, msg: error.details[0].message });

  Question.findByPk(+id)
    .then((question) => {
      if (!question) return res.send({ success: false, msg: "Question not found." });
      question
        .update(req.body)
        .then(() => res.send({ success: true, msg: "Question updated!" }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const deleteQuestion = (req, res) => {
  const id = req.params.id;
  Question.findByPK(+id)
    .then((question) => {
      if (!question) return res.send({ success: false, msg: "Question not found." });
      question
        .destroy()
        .then(() => res.send({ success: true, msg: "Question deleted!" }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const validateQuestion = (data) => {
  const schema = Joi.object({
    question: Joi.string().min(3).required(),
    answer: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(data);
  return error;
};

const validatePUTFAQ = (data) => {
  const schema = Joi.object({
    question: Joi.string().optional(),
    answer: Joi.string().optional(),
  });

  const { error } = schema.validate(data);
  return error;
};

module.exports = {
  getAllQuestions,
  postQuestion,
  updateQuestion,
  deleteQuestion,
};
