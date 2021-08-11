const Sequelize = require("sequelize");
const db = require("../config");

const ModelArch = db.define(
  "model_archs",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    alias: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(2000),
      allowNull: false,
    },
    paper: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

module.exports = ModelArch;
