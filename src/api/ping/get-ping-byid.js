const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
var ping = require("ping");
const logger = require("../../logger");
const utils = require("../../utils");

// Get Role by name
module.exports = exports = {
  handler: async (req, res) => {
    const { id } = req.query;
    console.log("id", id);
    try {
      let deviceData = await global.models.GLOBAL.DEVICE.findOne({
        _id: id,
      });
      console.log("deviceData", deviceData);
      if (!deviceData) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.GENERAL,
          register: false,
          payload: {},
          logPayload: false,
        };
        res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
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
            req: req,
            result: 0,
            message: messages.ROLE_FETCH_SUCCESS,
            register: true,
            payload: { newDevice },
            logPayload: false,
          };
          res
            .status(enums.HTTP_CODES.OK)
            .json(utils.createResponseObject(data4createResponseObject));
        }
      }
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
      );
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
