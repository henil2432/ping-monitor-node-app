const mongoose = require("mongoose");
const enums = require("../../../json/enums.json");

module.exports = (connection) => {
  const deviceSchema = new mongoose.Schema(
    {
      deviceName: { type: String, require: true },
      deviceIp: { type: String, require: true },
      intervalTime: { type: String, require: true },
      pingData: { type: Array },
      isActive: { type: Boolean, default: true },
    },
    {
      autoCreate: true,
      timestamps: true,
    }
  );

  // return logsSchema;
  return connection.model("deviceData", deviceSchema, "deviceData");
};
