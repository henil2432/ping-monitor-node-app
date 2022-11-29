const Joi = require("joi");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const logger = require("../../logger");
const utils = require("../../utils");

// User Profile update
module.exports = exports = {
  validation: Joi.object({
    roleName: Joi.string().allow(""),
    description: Joi.string().allow(""),
    isActivate: Joi.boolean().required(),
  }),

  handler: async (req, res) => {
    const { user } = req;
    let { roleId } = req.params;
    const roleStatus = await utils.checkStatus(user);

    if (roleStatus) {
      try {
        let body = {
          roleName: req.body.roleName,
          description: req.body.description,
          isActivate: req.body.isActivate,
          updatedBy: user.email,
          updatedAt: new Date(),
        };

        await global.models.GLOBAL.ROLE.findByIdAndUpdate(roleId, body);
        let data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.ITEM_UPDATED,
          payload: { body },
          logPayload: false,
        };
        res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
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
