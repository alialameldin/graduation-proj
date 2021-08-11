const Newsletter = require("../../models/Newsletter");
const getIdFromToken = require("../../../lib/getIdFromToken");
const User = require("../../models/User");
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 587,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

const isSubscribed = (req, res) => {
  const id = getIdFromToken(req.headers.authorization);
  Newsletter.findByPk(id)
    .then((user) => {
      if (user) {
        res.send({ success: true, data: true });
      } else {
        res.send({ success: true, data: false });
      }
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const getAllSubscribers = (req, res) => {
  Newsletter.findAll()
    .then((users) => res.send({ success: true, data: users }))
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const sendMailToSubscribers = (req, res) => {
  Newsletter.findAll()
    .then((users) => {
      const mails = [];
      users.forEach((user) => {
        mails.push(user.email);
      });

      const subject = req.body.subject;
      const html = req.body.text;

      const message = createMail(mails, subject, html);

      transport.sendMail(message, (err, info) => {
        if (err) {
          res.send({ success: false, msg: "There was an error sending the mail.", error: err });
        } else {
          res.send({ success: true, msg: "Email has been sent to all subscribers." });
        }
      });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const subscribeNewsletter = (req, res) => {
  const id = getIdFromToken(req.headers.authorization);

  User.findByPk(id)
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "User not found." });

      Newsletter.create({
        user_id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
      })
        .then(() => res.send({ success: true, msg: "Congratulations! You are now subscribed in our newsletter." }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const unsubscribeNewsletter = (req, res) => {
  const id = getIdFromToken(req.headers.authorization);
  User.findByPk(id)
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "User not found." });

      Newsletter.destroy({
        where: {
          user_id: user.id,
        },
      })
        .then(() => res.send({ success: true, msg: "You are now unsubscribed from our newsletter." }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const createMail = (recipients, subject, html) => {
  return {
    from: "support@sentimeter.dev",
    to: recipients,
    subject: subject,
    html: html,
  };
};

module.exports = {
  subscribeNewsletter,
  unsubscribeNewsletter,
  getAllSubscribers,
  sendMailToSubscribers,
  isSubscribed,
};
