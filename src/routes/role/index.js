const express = require("express");
const router = express.Router();
const api4Role = require("../../api/role/index");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Post Methods
router.post(
  "/create",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", api4Role.roleCreate.validation),
  api4Role.roleCreate.handler
);

// Get Method
router.get(
  "/",
  // passport.authenticate(["jwt"], { session: false }),
  api4Role.allRole.handler
);
// Get Method
router.get(
  "/roleName=:roleName",
  passport.authenticate(["jwt"], { session: false }),
  api4Role.getRoleByName.handler
);

// Put Method
router.put(
  "/id=:roleId",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", api4Role.roleUpdate.validation),
  api4Role.roleUpdate.handler
);

// Delete Method
router.delete(
  "/id=:roleId",
  passport.authenticate(["jwt"], { session: false }),
  api4Role.deleteRole.handler
);

module.exports = exports = router;
