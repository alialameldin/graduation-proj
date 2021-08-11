const router = require("express").Router();
const controllers = require("../database/controllers/execFiles");

router.get("/windows", controllers.getWindowsFile);
router.get("/linux", controllers.getLinuxFile);

module.exports = router;
