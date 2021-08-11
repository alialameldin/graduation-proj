const router = require("express").Router();
const passport = require("passport");
const controllers = require("../database/controllers/dashboard");

// FAQ
router.get("/faq", passport.authenticate("user", { session: false }), controllers.getAllQuestions);
router.post("/faq", passport.authenticate("admin", { session: false }), controllers.postQuestion);
router.put("/faq/:id", passport.authenticate("admin", { session: false }), controllers.updateQuestion);
router.delete("/faq/:id", passport.authenticate("admin", { session: false }), controllers.deleteQuestion);

// Newsletter
router.get("/newsletter/isSubscribed", passport.authenticate("user", { session: false }), controllers.isSubscribed);
router.get("/newsletter/subscribe", passport.authenticate("user", { session: false }), controllers.subscribeNewsletter);
router.get("/newsletter/unsubscribe", passport.authenticate("user", { session: false }), controllers.unsubscribeNewsletter);
router.get("/newsletter/", passport.authenticate("admin", { session: false }), controllers.getAllSubscribers);
router.post("/newsletter/send", passport.authenticate("admin", { session: false }), controllers.sendMailToSubscribers);

module.exports = router;
