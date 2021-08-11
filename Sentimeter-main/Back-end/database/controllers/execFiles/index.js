const path = require("path");
require("dotenv/config");

const getWindowsFile = (req, res) => {
  let FILE_PATH = path.join(process.env.SERVER_URL, "static", "tool", "Sentimeter_Dataset_Creator_Windows.zip");
  FILE_PATH = FILE_PATH.replace(":/", "://");
  res.send({ success: true, url: FILE_PATH });
};

const getLinuxFile = (req, res) => {
  let FILE_PATH = path.join(process.env.SERVER_URL, "static", "tool", "Dataset_Creator_Linux.deb");
  FILE_PATH = FILE_PATH.replace(":/", "://");
  res.send({ success: true, url: FILE_PATH });
};

module.exports = {
  getWindowsFile,
  getLinuxFile,
};
