const express = require("express");
const router = express.Router();
const api4Device = require("../../api/deviceData/index");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Post Methods
router.post(
  "/add-device",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", api4Device.addDevice.validation),
  api4Device.addDevice.handler
);

// Get Method
router.get(
  "/get-device",
  // passport.authenticate(["jwt"], { session: false }),
  api4Device.getDevice.handler
);
// // Get Method
// router.get(
//   "/roleName=:roleName",
//   passport.authenticate(["jwt"], { session: false }),
//   api4Role.getRoleByName.handler
// );

// // Put Method
// router.put(
//   "/id=:roleId",
//   passport.authenticate(["jwt"], { session: false }),
//   validate("body", api4Role.roleUpdate.validation),
//   api4Role.roleUpdate.handler
// );

// // Delete Method
// router.delete(
//   "/id=:roleId",
//   passport.authenticate(["jwt"], { session: false }),
//   api4Role.deleteRole.handler
// );

module.exports = exports = router;
