const ExtractJwt = require("passport-jwt").ExtractJwt;
require('dotenv').config();

module.exports = exports = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //
    passReqToCallback: true,
    secretOrKey: process.env.JWT_SECRET
};
