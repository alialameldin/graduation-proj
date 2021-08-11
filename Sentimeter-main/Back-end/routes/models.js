const router = require("express").Router();
const passport = require("passport");
const modelControllers = require("../database/controllers/userModels");

// Model Archs
router.get("/arch", passport.authenticate("user", { session: false }), modelControllers.getModelArchs);
router.get("/arch/:id", passport.authenticate("user", { session: false }), modelControllers.getOneModelArch);
router.post("/arch", passport.authenticate("admin", { session: false }), modelControllers.createModelArch);
router.put("/arch/:id", passport.authenticate("admin", { session: false }), modelControllers.updateModelArch);
router.delete("/arch/:id", passport.authenticate("admin", { session: false }), modelControllers.deleteModelArch);

// Model Categories
router.get("/category", passport.authenticate("user", { session: false }), modelControllers.getModelCategories);
router.get("/category/:id", passport.authenticate("user", { session: false }), modelControllers.getOneModelCategory);
router.post("/category", passport.authenticate("user", { session: false }), modelControllers.createModelCategory);
router.put("/category/:id", passport.authenticate("admin", { session: false }), modelControllers.updateModelCategory);
router.delete("/category/:id", passport.authenticate("admin", { session: false }), modelControllers.deleteModelCategory);

// Model Likes
router.get("/likes", passport.authenticate("user", { session: false }), modelControllers.getUserLikes);
router.get("/likesId", passport.authenticate("user", { session: false }), modelControllers.getLikedModelsId);
router.get("/likes/:id", passport.authenticate("user", { session: false }), modelControllers.getModelLikes);
router.post("/like", passport.authenticate("user", { session: false }), modelControllers.likeModel);
router.post("/unlike", passport.authenticate("user", { session: false }), modelControllers.unlikeModel);

// Model Bookmarks
router.get("/bookmarks", passport.authenticate("user", { session: false }), modelControllers.getUserBookmarks);
router.get("/bookmarksId", passport.authenticate("user", { session: false }), modelControllers.getBookmarkedModelsId);
router.post("/bookmark", passport.authenticate("user", { session: false }), modelControllers.bookmarkModel);
router.post("/unbookmark", passport.authenticate("user", { session: false }), modelControllers.unbookmarkModel);

// Model Image
router.post("/image/:modelId", passport.authenticate("user", { session: false }), modelControllers.uploadImage);
router.delete("/image/:modelId", passport.authenticate("user", { session: false }), modelControllers.removeImage);

// Model Dataset
router.post("/dataset/:modelId", passport.authenticate("user", { session: false }), modelControllers.uploadDataset);

// Model Predict
router.post("/predict/:modelId", modelControllers.predictVideo);

// Model H5
router.get("/files/:modelId", passport.authenticate("user", { session: false }), modelControllers.getModelFile);
router.delete("/files/:modelId", passport.authenticate("admin", { session: false }), modelControllers.removeModelFile);

// Model
router.get("/", passport.authenticate("user", { session: false }), modelControllers.getAllModels);
router.get("/me", passport.authenticate("user", { session: false }), modelControllers.getUserModels);
router.get("/me/:id", passport.authenticate("user", { session: false }), modelControllers.getOneUserModel);
router.get("/isOwner/:id", passport.authenticate("user", { session: false }), modelControllers.getIsModelOwner);
router.get("/:id", modelControllers.getOneModel);
router.post("/create", passport.authenticate("user", { session: false }), modelControllers.createModel);
router.put("/:id", passport.authenticate("user", { session: false }), modelControllers.updateModel);
router.post("/delete/:id", passport.authenticate("user", { session: false }), modelControllers.deleteModel);

module.exports = router;
