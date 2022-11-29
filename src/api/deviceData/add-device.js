const Joi = require("joi");
const jwt = require("jsonwebtoken");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");
// User Registration
module.exports = exports = {
  // route validation

  validation: Joi.object({
    deviceName: Joi.string().required(),
    deviceIp: Joi.string().required(),
    intervalTime: Joi.string().required(),
  }),

  handler: async (req, res) => {
    const { deviceName, deviceIp, intervalTime } = req.body;
    if (!deviceName || !deviceIp || !intervalTime) {
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.INVALID_PARAMETERS,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
    }
    try {
      let allRole = await global.models.GLOBAL.DEVICE.findOne({
        deviceIp: deviceIp,
      });
      let deviceCreate = {
        deviceName: deviceName,
        deviceIp: deviceIp,
        intervalTime: intervalTime,
      };

      if (allRole) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.DEVICE_ALREADY_EXIST,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        const newDevice = await global.models.GLOBAL.DEVICE(deviceCreate);
        newDevice.save().then(() => {
          let data4createResponseObject = {
            req: req,
            result: 0,
            message: messages.ITEM_INSERTED,
            payload: { newDevice },
            logPayload: false,
          };
          res
            .status(enums.HTTP_CODES.OK)
            .json(utils.createResponseObject(data4createResponseObject));
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  },
};
