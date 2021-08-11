const router = require("express").Router();
const controllers = require("../database/controllers/flask");

// User Data
router.post("/start_training/:id", controllers.startTraining);
router.post("/finish_training/:id", controllers.finishTraining);

module.exports = router;
