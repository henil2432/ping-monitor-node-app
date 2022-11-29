const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const adminSchema = new mongoose.Schema(
    {
      fname: { type: String, require: true },
      email: { type: String, require: true },
      password: { type: String },
      phone: { type: String },
      latestToken: { type: String },
      role: { type: mongoose.Schema.Types.ObjectId, ref: "role" },
      isActive: { type: Boolean, default: true },
    },
    {
      autoCreate: true,
      timestamps: true
    }
  );

  // return logsSchema;
  return connection.model("admin", adminSchema, "admin");
};
