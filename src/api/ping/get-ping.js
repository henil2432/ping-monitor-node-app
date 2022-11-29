const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
var ping = require("ping");
const logger = require("../../logger");
const utils = require("../../utils");

// Get All Role
module.exports = exports = {
  handler: async (id) => {
    console.log("data1111111", id);
    let deviceData = await global.models.GLOBAL.DEVICE.findOne({
      _id: id,
    });
    // console.log(allRole)
    // allRole = JSON.parse(JSON.stringify(allRole));
    // console.log(allRole)
    console.log("allDevice", deviceData);
    if (!deviceData) {
      let data4createResponseObject = {
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      return data4createResponseObject;
    } else {
      if (deviceData) {
        let pingData = await ping.promise.probe(deviceData.deviceIp);
        pingData = { ...pingData, createdAt: new Date() };
        const newDevice = await global.models.GLOBAL.DEVICE.findByIdAndUpdate(
          {
            _id: id,
          },
          {
            $push: { pingData: pingData },
          },

          { new: true }
        );
        let data4createResponseObject = {
          result: 0,
          message: messages.ROLE_FETCH_SUCCESS,
          payload: { newDevice },
          logPayload: false,
        };
        return data4createResponseObject;
      }
    }
  },
};
