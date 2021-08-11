const { Model } = require("../../models/Model");

const startTraining = (req, res) => {
  console.log("asd123 started training...");
  const id = req.params.id;
  Model.findByPk(id).then((model) => {
    if (!model) return res.send({ success: true, msg: "Started training..." });
    model
      .update({ training: true })
      .then()
      .catch((err) => console.log(err));
  });
  res.send("Hello from nodejs");
};

const finishTraining = (req, res) => {
  console.log("asd123 finished training...");
  const id = req.params.id;
  Model.findByPk(id).then((model) => {
    if (!model) return res.send({ success: true, msg: "Started training..." });
    model
      .update({ training: false, ready: true, accuracy: req.params.accuracy })
      .then()
      .catch((err) => console.log(err));
  });
  res.send("Hello from nodejs");
};

module.exports = {
  startTraining,
  finishTraining,
};
