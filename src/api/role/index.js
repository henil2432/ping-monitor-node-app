const roleCreate = require("./create-role");
const allRole = require("./get-all-role");
const getRoleByName = require("./get_role_by_name");
const roleUpdate = require("./update-role");
const deleteRole = require("./delete-role");

module.exports = exports = {
  roleCreate,
  allRole,
  roleUpdate,
  deleteRole,
  getRoleByName,
};
