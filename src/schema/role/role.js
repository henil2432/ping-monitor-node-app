const mongoose = require("mongoose");
module.exports = (connection) => {
  const roleSchema = new mongoose.Schema({
    roleName: String,
    description: String,
    isActivate: { type: String, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },{
    autoCreate: true
});
  return connection.model("role", roleSchema, "role");
};
