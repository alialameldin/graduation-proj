const { validatePassword, genPassword } = require("../../../lib/utils");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const getIdFromToken = require("../../../lib/getIdFromToken");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const User = require("../../models/User");
require("dotenv/config");

const PRIV_KEY = fs.readFileSync(path.join(__dirname, "..", "..", "..", "id_rsa_priv.pem"), "utf8");
const PUB_KEY = fs.readFileSync(path.join(__dirname, "..", "..", "..", "id_rsa_pub.pem"), "utf8");

const transport = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD,
  },
});

const changePassword = (req, res) => {
  const validationError = validateNewPassword(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });

  const id = getIdFromToken(req.headers.authorization);
  const { password, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) return res.send({ success: false, msg: "New password and confirm password don't match." });

  User.findByPk(id)
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "User not found." });
      const isValid = validatePassword(password, user.hash, user.salt);
      if (isValid) {
        const { salt, hash } = genPassword(newPassword);
        user
          .update({ hash: hash, salt: salt })
          .then(() => {
            res.send({ success: true, msg: "Password updated successfully!" });
          })
          .catch((err) => res.send({ success: false, msg: err }));
      } else {
        res.send({ success: false, msg: "You have entered a wrong current password." });
      }
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const forgotPassword = (req, res) => {
  const validationError = validateEmail(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });

  const { email } = req.body;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "There is no account with this email." });
      const payload = {
        sub: user.id,
        iat: Date.now(),
      };
      const signedToken = jwt.sign(payload, PRIV_KEY, { expiresIn: "1h", algorithm: "RS256" });
      const resetLink = `${process.env.DOMAIN_URL}/reset_password/${signedToken}`;
      const html = `
          <h1>Forgot your password</h1>
          <p>There is a request sent to reset your password. If it is not you, just forget about this mail.</p>
          <p>You can use the link below to reset your password.</p>
          <a href="${resetLink}">Click here</a>
          <br />
          <br />
          <p>The link expires in 1 hour.</p>
        `;

      const message = createMail(email, "Request to reset password", html);

      transport.sendMail(message, (err, info) => {
        if (err) {
          res.send({ success: false, msg: "There was an error sending the email.", error: err });
        } else {
          res.send({ success: true, msg: "An email has been sent to your inbox." });
        }
      });
      // res.send({ success: true, data:  });
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const resetPassword = (req, res) => {
  const validationError = validateResetPasswords(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });

  const { password, confirmPassword, token } = req.body;
  const JWTToken = token.split(" ")[1];
  jwt.verify(JWTToken, PUB_KEY, (error) => {
    if (error) {
      return res.status().json({ status: false, msg: "Incorrect or expired token." });
    }
  });

  const id = getIdFromToken(token);

  User.findByPk(id)
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "User not found." });
      if (password !== confirmPassword) return res.send({ success: false, msg: "New password and confirm password don't match." });
      const { salt, hash } = genPassword(password);
      user
        .update({ hash: hash, salt: salt })
        .then((resp) => res.send({ success: true, msg: "Password updated successfully!" }))
        .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const validateNewPassword = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(data);
  return error;
};

const validateResetPasswords = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required(),
    token: Joi.string().required(),
  });

  const { error } = schema.validate(data);
  return error;
};

const validateEmail = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(data);
  return error;
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
  changePassword,
  resetPassword,
  forgotPassword,
};
