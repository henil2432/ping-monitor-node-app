const Joi = require("joi");
const jwt = require("jsonwebtoken");

const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");

const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const admin = require("../../schema/admin/admin");
const utils = require("../../utils");
const axios = require("axios");

module.exports = exports = {
  // router validation
  validation: Joi.object({
    email: Joi.string(),
    password: Joi.string(),
  }),

  // route handler
  handler: async (req, res) => {
    let { email, password } = req.body;
    console.log("req.body>>>>>>>>>", req.body);

    try {
      let admin = await global.models.GLOBAL.ADMIN.findOne(
        { email: email },
        { latestToken: 0 }
      );
      if (!admin) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.USER_DOES_NOT_EXIST,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        if (admin.isActive == false) {
          let data4createResponseObject = {
            req: req,
            result: -1,
            message: messages.BLOCKED_BY_ADMIN,
            payload: {},
            logPayload: false,
          };
          return res
            .status(enums.HTTP_CODES.NOT_ACCEPTABLE)
            .json(utils.createResponseObject(data4createResponseObject));
        }
        if (password) {
          if (admin.password !== password) {
            const data4createResponseObject = {
              req: req,
              result: -1,
              message: messages.USER_NOT_FOUND,
              payload: {},
              logPayload: false,
            };
            return res
              .status(enums.HTTP_CODES.NOT_FOUND)
              .json(utils.createResponseObject(data4createResponseObject));
          }
        }
      }

      let rolename = await global.models.GLOBAL.ROLE.findOne({
        _id: admin.role,
      }).populate({ path: "admin.role", model: "role" });
      if (!rolename) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ROLE_DOES_NOT_FETCH,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }
      if (rolename.roleName === "admin") {
        role = enums.USER_TYPE.ADMIN;
      } else if (rolename.roleName === "user") {
        role = enums.USER_TYPE.USER;
      } else if (rolename.roleName === "superadmin") {
        role = enums.USER_TYPE.SUPERADMIN;
      } else if (rolename.roleName === "teamleader") {
        role = enums.USER_TYPE.TEAMLEADER;
      }
      // User found - create JWT and return it
      const storeData = await axios
        .get("https://fakestoreapi.com/products/1")
        .then((res) => {
          return res.data;
        });
      const data4token = {
        id: admin._id,
        date: new Date(),
        environment: process.env.APP_ENVIRONMENT,
        email: email,
        scope: "login",
        type: role,
      };
      delete admin._doc.password;
      let payload = {
        admin: admin,
        token: jwt.sign(data4token, jwtOptions.secretOrKey),
        token_type: "Bearer",
        store: storeData,
      };
      let updateAdmin = await global.models.GLOBAL.ADMIN.findOneAndUpdate(
        { _id: admin._id },
        { latestToken: payload.token },
        { new: true }
      );
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.LOGIN_SUCCESS,
        payload: payload,
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
      );
      const data4createResponseObject = {
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
