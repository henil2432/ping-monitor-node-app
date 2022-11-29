/**
 * Created by Bhargav Butani on 06.07.2021.
 */
const _ = require("lodash");
const accepts = require("accepts");
const crypto = require("crypto");
const flatten = require("flat");
const bcrypt = require("bcryptjs");

//  const twilio = require("twilio")(global.config.TWILIO.SID, global.config.TWILIO.TOKEN);
//  const enums = require("../json/enums");

const logger = require("./logger");
const { default: jwtDecode } = require("jwt-decode");

// const { s3Config } = require("./config");

//  const geocoder = require("node-geocoder")({
//      provider: "google",
//      httpAdapter: "https",
//      apiKey: global.config.GOOGLE.API.KEY,
//      formatter: null
//  });

/* firebase */
//  const firebaseConfig = require("../config-firebase.json");
//  const firebaseConfigAdmin = require("../service-account-firebase-admin.json");
//  const firebaseAdmin = require("firebase-admin");
//  firebaseAdmin.initializeApp({
//      credential: firebaseAdmin.credential.cert(firebaseConfigAdmin),
//      databaseURL: firebaseConfig.databaseURL
//  });

let functions = {};

functions.config4hashes = {
  // size of the generated hash
  hashBytes: 32,
  // larger salt means hashed passwords are more resistant to rainbow table, but
  // you get diminishing returns pretty fast
  saltBytes: 16,
  // more iterations means an attacker has to take longer to brute force an
  // individual password, so larger is better. however, larger also means longer
  // to hash the password. tune so that hashing the password takes about a
  // second
  iterations: 872791,
};

/* create response-wrapper object */
functions.createResponseObject = ({
  req,
  result = 0,
  message = "",
  payload = {},
  logPayload = false,
}) => {
  let payload2log = {};
  if (logPayload) {
    payload2log = flatten({ ...payload });
  }

  let messageToLog = `RES [${req.requestId}] [${req.method}] ${req.originalUrl}`;
  messageToLog +=
    (!_.isEmpty(message) ? `\n${message}` : "") +
    (!_.isEmpty(payload) && logPayload
      ? `\npayload: ${JSON.stringify(payload2log, null, 4)}`
      : "");

  if (result < 0 && (result !== -50 || result !== -51)) {
    logger.error(messageToLog);
  } else if (!_.isEmpty(messageToLog)) {
    logger.info(messageToLog);
  }

  return { result: result, message: message, payload: payload };
};

/* Geocoding - convert address to geocodes */
functions.geocode = async (address) => {
  try {
    const result = await geocoder.geocode(address);
    if (result !== null && result.length > 0) {
      return {
        latitude: result[0].latitude,
        longitude: result[0].longitude,
      };
    }
    return null;
  } catch (error) {
    logger.error(
      `#geocode - Error encountered while getting the geocodes from address: ${error.message}\n${error.stack}`
    );
    return null;
  }
};

/* Return the language of the logged-in user. If it is not present, get it from the request query parameter. */
functions.getLocale = (req) => {
  const locale = {
    country: "IN",
    lang: "en",
  };

  if (!req) {
    return locale;
  }

  let parts = [];

  if (!_.isEmpty(req.headers["accept-language"])) {
    const accept = accepts(req);
    const languages = accept.languages();
    logger.info("#getLocale - accepted languages: " + languages);

    if (languages) {
      let localeFromRequest = languages[0];
      parts = localeFromRequest.split("_");
      locale.lang = parts[0];
      if (parts.length > 1) {
        locale.country = parts[1].toUpperCase();
      }
    }

    logger.info(
      "#getLocale - (from request headers) " + JSON.stringify(locale)
    );
    if (locale.lang !== "en") {
      locale.lang = "en";
    }
    return locale;
  } else if (
    typeof req.query.locale !== "undefined" &&
    req.query.locale !== null &&
    req.query.locale.length > 0
  ) {
    let localeFromParameter = req.query.locale;
    parts = localeFromParameter.split("_");
    locale.lang = parts[0];
    if (parts.length > 1) {
      locale.country = parts[1];
    }

    logger.info("#getLocale - (from query params) " + JSON.stringify(locale));
    if (locale.lang !== "en") {
      locale.lang = "en";
    }
    return locale;
  } else if (typeof req.user !== "undefined" && req.user !== null) {
    let localeFromUser = req.user.locale;
    if (
      typeof localeFromUser !== "undefined" &&
      localeFromUser !== null &&
      localeFromUser.length > 0
    ) {
      parts = localeFromUser.split("_");
      locale.lang = parts[0];
      if (parts.length > 1) {
        locale.country = parts[1];
      }

      logger.info("#getLocale - (from profile) " + JSON.stringify(locale));
      if (locale.lang !== "en") {
        locale.lang = "en";
      }
      return locale;
    }
  }

  // logger.info("#getLocale - " + JSON.stringify(locale));
  return locale;
};

/* Return true if the app is in production mode */
functions.isLocal = () => process.env.APP_ENVIRONMENT.toLowerCase() === "local";

/* Return true if the app is in production mode */
functions.isProduction = () =>
  process.env.APP_ENVIRONMENT.toLowerCase() === "production" ||
  process.env.APP_ENVIRONMENT.toLowerCase() === "prod";

/* Return true if the app is in production mode */
functions.isTest = () => process.env.APP_ENVIRONMENT.toLowerCase() === "test";

/* Mask a name to initials - e.g., change Bhargav Butani to A. B. */
functions.maskName = (name) => {
  let maskedName = "";
  if (name) {
    const nameParts = name.split(/(\s+)/);
    for (let i = 0; i < nameParts.length; i++) {
      if (nameParts[i].trim().length > 0) {
        maskedName += nameParts[i].charAt(0) + ". ";
      }
    }
  }
  return maskedName.trim();
};

/* Mask a number - e.g., change 0041123456789 to 0041*****6789 */
functions.maskPhone = (phone) => {
  let maskedPhone = "";
  if (phone) {
    maskedPhone =
      phone.substring(0, 4) +
      phone
        .substring(4, phone.length - 4)
        .replace(new RegExp("[0-9]", "g"), "*") +
      phone.substring(phone.length - 4);
  }
  return maskedPhone;
};

functions.passwordHash = (password) =>
  crypto.createHash("sha256").update(password.toString()).digest("hex");

functions.checkStatus = async (user) => {
  const role = user.role;
  const findRole = await global.models.GLOBAL.ROLE.findById(role);
  if (findRole) {
    let status = findRole.isActivate === "true" ? true : false;
    return status;
  }
};
//  Bcrypt hash password
//  functions.passwordHash = async (password) => {
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);
//     console.log("hash", hash)
//     return hash;
//  };

/* Send SMS */
functions.sendMessage = async (parameters) => {
  logger.info(
    "#sendMessage - parameters: " + JSON.stringify(parameters, null, 4)
  );
  const event = parameters.event || {};
  const ignoreEnvironment = parameters.ignoreEnvironment || false;
  const lang = parameters.lang || "en";
  const name = parameters.name || "";
  const phone = parameters.phone || "";

  if (_.isEmpty(phone)) {
    logger.info(
      "#sendMessage - The phone number cannot be empty. No SMS will be sent out."
    );
    return null;
  }

  let messageToSend = "";
  if (_.isEmpty(event.message[lang])) {
    messageToSend = event.message["en"]; // (!_.isEmpty(event.summary[ "en" ]) ? (event.summary[ "en" ] + " " + name + ",\n") : "") + event.message[ "en" ];
  } else {
    messageToSend = event.message[lang]; // (!_.isEmpty(event.summary[ lang ]) ? (event.summary[ lang ] + " " + name + ",\n") : "") + event.message[ lang ];
  }

  //  let phone4twilio = phone;
  //  if (phone4twilio.indexOf("00") !== 0 && phone4twilio.indexOf("+") !== 0) {
  //      phone4twilio = "+91" + phone4twilio;
  //  } else if (phone4twilio.indexOf("00") === 0) {
  //      phone4twilio = "+" + phone4twilio.slice(2);
  //  }

  //  const phoneDetails = await functions.validatePhoneNumber(phone4twilio);
  //  if (phoneDetails) {
  //      // logger.info('#sendMessage - phoneDetails: ' + JSON.stringify(phoneDetails, null, 4));
  //      if (functions.isProduction() || ignoreEnvironment) {
  //          try {
  //              const messageDetails = await twilio.messages.create({
  //                  body: messageToSend,
  //                  from: "", // '',
  //                  to: phone4twilio
  //              });

  //              if (!messageDetails) {
  //                  logger.error("#sendMessage - Message sending failed to " + phone4twilio + ". Reason: n.a.");
  //                  return null;
  //              } else if (messageDetails.errorCode !== null) {
  //                  logger.error("#sendMessage - Message sending failed to " + phone4twilio + ". result: " + JSON.stringify(messageDetails));
  //                  return null;
  //              } else {
  //                  messageDetails.countryCode = phoneDetails.countryCode;
  //                  logger.info("#sendMessage - Message sent to " + phone4twilio + " on " + messageDetails.dateCreated);
  //                  return messageDetails;
  //              }
  //          } catch (error) {
  //              logger.error("#sendMessage - Message sending failed to " + phone4twilio + ". Reason: " + error);
  //              return null;
  //          }
  //      } else {
  //          logger.info(`No SMS are sent out in ${process.env.APP_ENVIRONMENT.toUpperCase()} environment`);
  //          return null;
  //      }
  //  } else {
  //      return null;
  //  }
};

/** Sort a JSON by keys */
functions.sortByKeys = (obj) => {
  if (_.isEmpty(obj)) {
    return obj;
  }

  const sortedObj = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sortedObj[key] = obj[key];
    });

  return sortedObj;
};

functions.validateEmail = (email) => {
  if (_.isEmpty(email)) {
    return false;
  }
  const regex = new RegExp(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
  );
  return regex.test(email);
};

/** Validate a phone number */
functions.validatePhoneNumber = async (phone4twilio) => {
  if (_.isEmpty(phone4twilio)) {
    return null;
  } else {
    if (phone4twilio.indexOf("00") !== 0 && phone4twilio.indexOf("+") !== 0) {
      phone4twilio = "+" + phone4twilio;
    } else if (phone4twilio.indexOf("00") === 0) {
      phone4twilio = "+" + phone4twilio.slice(2);
    }

    try {
      const phoneDetails = await twilio.lookups
        .phoneNumbers(phone4twilio)
        .fetch();
      if (phoneDetails) {
        logger.info(
          "#validatePhoneNumber - phoneDetails: " +
            JSON.stringify(phoneDetails, null, 4)
        );
        return phoneDetails;
      }
    } catch (error) {
      logger.error(
        `#validatePhoneNumber - Error encountered while validating phone number: ${error.stack}`
      );
      return null;
    }
  }
};

functions.getHeaderFromToken = async (token) => {
  const decodedToken = jwtDecode(token, {
    complete: true,
  });

  if (!decodedToken) {
    return null;
  }

  return decodedToken;
};

/* This has to be the last line - add all functions above. */
module.exports = exports = functions;
