const usersLoginRegister = require("./loginRegister");
const usersCurrent = require("./currentUser");
const usersPassword = require("./password");
const users = require("./user");
const usersImage = require("./userImage");

module.exports = {
  ...usersLoginRegister,
  ...usersCurrent,
  ...usersPassword,
  ...users,
  ...usersImage,
};
