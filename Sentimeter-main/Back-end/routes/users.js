const router = require("express").Router();
const passport = require("passport");
const controllers = require("../database/controllers/users");

// User Data
router.get("/users/:username", passport.authenticate("user", { session: false }), controllers.getUserDataByUsername);

// Login and Register
router.post("/login", controllers.loginUser);
router.post("/signup", controllers.createUser);
router.post("/verify_email", controllers.verifyUser);
router.post("/resend_verification_email", controllers.resendVerificationMail);
router.get("/", passport.authenticate("admin", { session: false }), controllers.getAllUsers);

// User Image
router.post("/image/change", passport.authenticate("user", { session: false }), controllers.uploadImage);
router.delete("/image/remove", passport.authenticate("user", { session: false }), controllers.removeImage);

// Current User
router.get("/me", passport.authenticate("user", { session: false }), controllers.getCurrentUser);
router.put("/me", passport.authenticate("user", { session: false }), controllers.updateCurrentUser);
router.delete("/me", passport.authenticate("user", { session: false }), controllers.deleteCurrentUser);

// Password
router.post("/password/change", controllers.changePassword);
router.post("/password/forgot", controllers.forgotPassword);
router.post("/password/reset", controllers.resetPassword);

module.exports = router;
