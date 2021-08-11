const User = require("../../models/User");
const { Model } = require("../../models/Model");

const getUserDataByUsername = (req, res) => {
  const username = req.params.username;
  User.findOne({ where: { username: username } })
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "User not found.", notFound: true });
      Model.findAll({ where: { user_id: user.id }, include: { model: User, attributes: ["username"] }, order: [["created_at", "DESC"]] })
        .then((models) => {
          const data = {
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            image: user.image,
            models: models,
          };
          res.send({ success: true, data: data });
        })
        .catch((err) => res.send({ success: false, msg: "There was an error fetching user's models.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error fetching user.", error: err }));
};

module.exports = {
  getUserDataByUsername,
};
