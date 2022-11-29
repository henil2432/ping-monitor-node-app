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
    roleName: Joi.string().required(),
    description: Joi.string().required(),
  }),

  handler: async (req, res) => {
    const { user } = req;
    console.log("user", user);
    const roleStatus = await utils.checkStatus(user);

    if (roleStatus) {
      const { roleName, description } = req.body;

      if (!roleName || !description) {
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
        let roleCreate = {
          roleName: roleName,
          description: description,
        };
        let findRole = await global.models.GLOBAL.ROLE.findOne({
          roleName: roleCreate.roleName,
        });
        if (findRole) {
          let data4createResponseObject = {
            req: req,
            result: -1,
            message: messages.ROLE_ALREADY_EXISTS,
            payload: {},
            logPayload: false,
          };
          res
            .status(enums.HTTP_CODES.NOT_ACCEPTABLE)
            .json(utils.createResponseObject(data4createResponseObject));
        } else {
          const newRole = await global.models.GLOBAL.ROLE(roleCreate);
          newRole.save().then(() => {
            let data4createResponseObject = {
              req: req,
              result: 0,
              message: messages.ITEM_INSERTED,
              payload: {},
              logPayload: false,
            };
            res
              .status(enums.HTTP_CODES.OK)
              .json(utils.createResponseObject(data4createResponseObject));
          });
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
