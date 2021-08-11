const dashboardFAQ = require("./faq");
const dashboardNewsletter = require("./newsletter");

module.exports = {
  ...dashboardFAQ,
  ...dashboardNewsletter,
};
