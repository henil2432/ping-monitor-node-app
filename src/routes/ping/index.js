const express = require("express");
const router = express.Router();
const api4Ping = require("../../api/ping/index");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Post Methods
router.post(
  "/get-ping",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", api4Ping.getPing.validation),
  api4Ping.getPing.handler
);

// Get Method
router.get(
  "/get-ping-byid",
  // passport.authenticate(["jwt"], { session: false }),
  api4Ping.getPingById.handler
);

module.exports = exports = router;
