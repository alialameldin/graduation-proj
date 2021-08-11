const Sequelize = require("sequelize");
const db = require("../config");

const Question = db.define(
  "question",
  {
    question: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    answer: {
      type: Sequelize.STRING(2000),
      allowNull: false,
    },
  },
  { underscored: true }
);

module.exports = Question;
