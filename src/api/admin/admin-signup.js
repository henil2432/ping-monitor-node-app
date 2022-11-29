/**
 * Created by Bhargav Butani on 16.07.2021
 */
const _ = require("lodash");
const Joi = require("joi");
const ObjectId = require("mongodb").ObjectId;
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const jwt = require("jsonwebtoken");
const logger = require("../../logger");
const utils = require("../../utils");
const jwtOptions = require("../../auth/jwt-options");
const role = require("../../routes/role");
module.exports = exports = {
  // router validation
  validation: Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
    fname: Joi.string(),
    lname: Joi.string(),
    phone: Joi.string(),
    role: Joi.string(),
  }),

  // route handler
  handler: async (req, res) => {
    let {
      email,
      password,
      fname,
      lname,
      phone,
      role,
    } = req.body;
    console.log("req.boy", req.body)
    if (password) {
      if (password.length < 6) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.PASSWORD_LENGTH,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }
    }

    //  // salting a password
    //  const salt = await bcrypt.genSalt(10);
    //  const hash = await bcrypt.hash(password, salt);
    //  const isMatch = await bcrypt.compare(password, user.password);

    // check if email already exist

    let emailExist = await global.models.GLOBAL.ADMIN.findOne({
      email: email,
    });
    // if (aid) {
    //   emailExist = await global.models.GLOBAL.ADMIN.findOne({
    //     email: email,
    //     aid: aid,
    //   });
    // }
    if (emailExist) {
      const data4createResponseObject = {
        req: req,
        result: -400,
        message: messages.EXISTS_EMAIL,
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.DUPLICATE_VALUE)
        .json(utils.createResponseObject(data4createResponseObject));
      return;
    }

    /* Save into mongodb */
    const rolename1 = await global.models.GLOBAL.ROLE.findOne({
      _id: role,
    }).populate({
      path: "role",
      model: "role",
      select: "_id roleName",
    });
    const uid = new ObjectId();

    const adminObject = {
      _id: uid,
      email: email,
      password: password,
      fname: fname,
      lname: lname,
      phone: phone,
      role: rolename1,
    };

    const newAdmin = global.models.GLOBAL.ADMIN(adminObject);

    try {
      await newAdmin.save();
    } catch (error) {
      logger.error(
        "/admin - Error encountered while trying to add new admin:\n" + error
      );
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FAILED_REGISTRATION,
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
      return;
    }
    let rolename = await global.models.GLOBAL.ROLE.findOne({
      _id: newAdmin.role,
    });
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
    }

    const data4token = {
      id: adminObject._id,
      date: new Date(),
      environment: process.env.APP_ENVIRONMENT,
      email: email,
      scope: "login",
      type: role,
    };

    const payload = {
      admin: {
        _id: adminObject._id,
        email: adminObject.email,
        phone: adminObject.phone,
        fname: adminObject.fname,
        lname: adminObject.lname,
        role: adminObject.role,
      },
      token: jwt.sign(data4token, jwtOptions.secretOrKey),
      token_type: "Bearer",
    };

    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.REGISTER_SUCCESS,
      payload: payload,
      logPayload: false,
    };
    return res
      .status(enums.HTTP_CODES.OK)
      .json(utils.createResponseObject(data4createResponseObject));
  },
};
