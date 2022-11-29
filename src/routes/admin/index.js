const express = require("express");
const router = express.Router();
const adminApi = require("../../api/admin");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get(
  "/get-users",
  // passport.authenticate(["jwt"], { session: false }),
  adminApi.getUsers.handler
);

// Login
router.post(
  "/login",
  validate("body", adminApi.adminLogin.validation),
  adminApi.adminLogin.handler
);

// Signup
router.post(
  "/signup",
  validate("body", adminApi.adminSignup.validation),
  adminApi.adminSignup.handler
);

module.exports = exports = router;
