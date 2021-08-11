const User = require("../../models/User");
const { validatePassword, issueJWT, genPassword } = require("../../../lib/utils");
const Joi = require("joi");
const crypto = require("crypto");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
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

const loginUser = (req, res) => {
  const emailRegex = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)$/;

  const loginHandler = (user) => {
    if (!user) return res.send({ success: false, msg: "This username / email is not registered in our database." });
    if (!user.verified_email) return res.send({ success: false, msg: "Please verify your email first." });
    const isValid = validatePassword(req.body.password, user.hash, user.salt);

    if (isValid) {
      const tokenObject = issueJWT(user);
      const userSendData = {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };
      res.send({ success: true, user: userSendData, token: tokenObject.token, expiresIn: tokenObject.expires });
    } else {
      res.send({ success: false, msg: "You have entered a wrong password." });
    }
  };

  if (emailRegex.test(req.body.username)) {
    type = "email";
    User.findOne({ where: { email: req.body.username } })
      .then((user) => loginHandler(user))
      .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
  } else {
    User.findOne({ where: { username: req.body.username } })
      .then((user) => loginHandler(user))
      .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
  }
};

const createUser = (req, res) => {
  const validationError = validateRegister(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });

  const { username, firstname, lastname, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.send({ success: false, msg: "Passwords don't match." });
  const { salt, hash } = genPassword(password);
  const id = crypto.randomBytes(10).toString("hex");
  const userData = {
    id: id,
    username: username,
    firstname: firstname,
    lastname: lastname,
    email: email,
    hash: hash,
    salt: salt,
  };
  User.findOne({ where: { username: username } })
    .then((user) => {
      if (user) {
        res.send({ success: false, msg: "This username already exists." });
      }
    })
    .catch((err) => res.send({ success: false, msg: "Error finding any user with that username", error: err }));

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        res.send({ success: false, msg: "This email already exists." });
      }
    })
    .catch((err) => res.send({ success: false, msg: "Error finding any user with that email", error: err }));

  User.create(userData)
    .then((user) => {
      const error = sendMail(res, user.id, user.email);
      if (error) return res.send({ success: false, msg: "There was an error sending the verification mail.", error: error });
      return res.status(201).send({ success: true, msg: "An email has been sent to your inbox to validate your account." });
    })
    .catch((err) => {
      res.send({ success: false, msg: "We can't complete the signup process. Please try again!", error: err });
    });
};

const resendVerificationMail = (req, res) => {
  const id = req.body.id;

  User.findByPk(id)
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "User not found." });
      if (user.verified_email) return res.send({ success: false, msg: "You already verified your email." });
      sendMail(res, user.id, user.email);
      res.status(201).send({ success: true, msg: "The verification email has been re-sent to your inbox." });
    })
    .catch((err) => res.send({ success: false, msg: "We can't re-send the verification email!", error: err }));
};

const verifyUser = (req, res) => {
  const validationError = validateUserVerification(req.body);
  if (validationError) return res.send({ success: false, msg: validationError.details[0].message });

  const { id, token } = req.body;

  User.findByPk(id)
    .then((user) => {
      if (!user) return res.send({ success: false, msg: "User not found." });
      if (user.verified_email) return res.send({ success: false, msg: "You already verified your email." });
      jwt.verify(token, PUB_KEY, (error) => {
        if (error) {
          return res.status().json({ status: false, msg: "Incorrect or expired token." });
        }
      });
      user
        .update({ verified_email: true })
        .then(() => res.send({ success: true, msg: "Email verified successfully!" }))
        .catch((err) => res.send({ success: false, msg: "We can't complete the signup process. Please try again!", error: err }));
    })
    .catch((err) => res.send({ success: false, msg: "We can't verify your email. Please try again!", error: err }));
};

const getAllUsers = (req, res) => {
  User.findAll()
    .then((users) => res.send({ success: true, data: users }))
    .catch((err) => res.send({ success: false, msg: "There was an error.", error: err }));
};

const validateRegister = (data) => {
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(data);
  return error;
};

const validateUserVerification = (data) => {
  const schema = Joi.object({
    token: Joi.string().required(),
    id: Joi.string().required(),
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

const sendMail = (res, id, email) => {
  let error = false;
  const payload = {
    sub: id,
    iat: Date.now(),
  };
  const signedToken = jwt.sign(payload, PRIV_KEY, { expiresIn: "1h", algorithm: "RS256" });
  const resetLink = `${process.env.DOMAIN_URL}/verify_email/${id}/${signedToken}`;
  const html = `
      <h1>Verify your email now.</h1>
      <p>An account registered to our web app using this email. If it is not you, just forget about this mail.</p>
      <p>If it was you, you can verify your email using the following link in order to start using our services.</p>
      <a href="${resetLink}">Click here</a>
      <br />
      <br />
      <p>The link expires in 1 hour.</p>
    `;

  const message = createMail(email, "Email Verification.", html);

  transport.sendMail(message, (err, info) => {
    if (err) {
      error = err;
    }
  });

  return error;
};

module.exports = {
  createUser,
  getAllUsers,
  loginUser,
  verifyUser,
  resendVerificationMail,
};
