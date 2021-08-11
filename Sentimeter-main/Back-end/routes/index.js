const router = require("express").Router();
const fileUpload = require("express-fileupload");

router.use(fileUpload());
router.use("/users", require("./users"));
router.use("/dashboard", require("./dashboard"));
router.use("/models", require("./models"));
router.use("/exec_files", require("./execFiles"));
router.use("/flask", require("./flask"));

module.exports = router;
