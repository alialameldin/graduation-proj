const Sequelize = require("sequelize");
const db = require("../config");

const User = db.define(
  "user",
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    admin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verified_email: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    hash: {
      type: Sequelize.STRING(300),
      allowNull: false,
    },
    salt: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

module.exports = User;
