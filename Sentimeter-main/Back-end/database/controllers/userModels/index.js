const modelArchs = require("./modelArch");
const modelCategories = require("./modelCategory");
const model = require("./model");
const modelLikeBookmark = require("./modelLikeBookmark");
const modelImage = require("./modelImage");
const modelFile = require("./modelFile");
const modelDataset = require("./modelDataset");
const modelPredict = require("./modelPredict");

module.exports = {
  ...modelArchs,
  ...modelCategories,
  ...model,
  ...modelLikeBookmark,
  ...modelImage,
  ...modelFile,
  ...modelDataset,
  ...modelPredict,
};
