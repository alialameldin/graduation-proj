const Sequelize = require("sequelize");
const db = require("../config");

const ModelCategory = db.define(
  "model_categories",
  {
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

module.exports = ModelCategory;
