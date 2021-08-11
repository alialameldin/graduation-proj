const Sequelize = require("sequelize");
const db = require("../config");
const User = require("./User");
const ModelCategory = require("./ModelCategory");
const ModelArch = require("./ModelArch");

const Model = db.define(
  "models",
  {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING(2000),
      allowNull: true,
      defaultValue: "",
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    dataset_path: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    likes: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    accuracy: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    training: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ready: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    filePath: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    },
  },
  { underscored: true }
);

Model.belongsTo(User, { foreignKey: "user_id", onDelete: "cascade" });
Model.belongsTo(ModelCategory, { foreignKey: "cat_id" });
Model.belongsTo(ModelArch, { foreignKey: "arch_id" });

const LikedModels = db.define("liked_models", {}, { timestamps: true, underscored: true });
const BookmarkedModels = db.define("bookmarked_models", {}, { timestamps: true, underscored: true });

User.belongsToMany(Model, { through: LikedModels, foreignKey: "uid" });
Model.belongsToMany(User, { through: LikedModels, foreignKey: "mid" });

User.belongsToMany(Model, { through: BookmarkedModels, foreignKey: "uid" });
Model.belongsToMany(User, { through: BookmarkedModels, foreignKey: "mid" });

module.exports = { Model, LikedModels, BookmarkedModels };
