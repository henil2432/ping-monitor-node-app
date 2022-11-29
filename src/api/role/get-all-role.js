const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// Get All Role
module.exports = exports = {
  handler: async (req, res) => {
    // const { user } = req;
    // const roleStatus = await utils.checkStatus(user);
    const { roleId } = req.query;
    let criteria = {};
    if (roleId) {
      criteria = {
        _id: roleId,
      };
    }
    if (1) {
      // if (roleStatus) {
      try {
        let allRole = await global.models.GLOBAL.ROLE.find({
          ...criteria,
        });
        // console.log(allRole)
        // allRole = JSON.parse(JSON.stringify(allRole));
        // console.log(allRole)

        if (!allRole) {
          let data4createResponseObject = {
            req: req,
            result: -1,
            message: messages.GENERAL,
            payload: {},
            logPayload: false,
          };
          res
            .status(enums.HTTP_CODES.BAD_REQUEST)
            .json(utils.createResponseObject(data4createResponseObject));
        } else {
          let data4createResponseObject = {
            req: req,
            result: 0,
            message: messages.ROLE_FETCH_SUCCESS,
            payload: { allRole },
            logPayload: false,
          };
          res
            .status(enums.HTTP_CODES.OK)
            .json(utils.createResponseObject(data4createResponseObject));
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
    } else {
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.NOT_ALLOWED,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.METHOD_NOT_ALLOWED)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
