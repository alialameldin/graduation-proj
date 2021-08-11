const Sequelize = require("sequelize");
require("dotenv/config");

module.exports = new Sequelize(process.env.DB_CONNTECTION_STRING, {
  logging: false,
});
