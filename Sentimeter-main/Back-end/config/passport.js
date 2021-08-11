const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const fs = require("fs");
const path = require("path");
const User = require("../database/models/User");

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
  // The JWT payload is passed into the verify callback
  passport.use(
    "admin",
    new JwtStrategy(options, function (jwt_payload, done) {
      User.findOne({ where: { id: jwt_payload.sub, admin: true } })
        .then((user) => {
          if (!user) return done(null, false);
          return done(null, user);
        })
        .catch((err) => done(err, false));
    })
  );

  passport.use(
    "user",
    new JwtStrategy(options, function (jwt_payload, done) {
      User.findOne({ where: { id: jwt_payload.sub } })
        .then((user) => {
          if (!user) return done(null, false);
          return done(null, user);
        })
        .catch((err) => done(err, false));
    })
  );
};
