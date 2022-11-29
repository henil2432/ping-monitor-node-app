/**
 * Authentication strategies
 * Created by Bhargav Butani, on 08.05.2021.
 */
"use strict";

//  const AnonymousStrategy = require("passport-anonymous").Strategy;
//  const BasicStrategy = require("passport-http").BasicStrategy;
//  const ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
//  const LocalStrategy = require("passport-local").Strategy;
const moment = require("moment");
const passport = require("passport");
const { isEmpty } = require("lodash");

const enums = require("../../json/enums.json");

const jwtOptions = require("./jwt-options");
const logger = require("../logger");

const { NODE_ENV = "local" } = process.env;

module.exports.setup = () => {
  /**
   * AnonymousStrategy
   *
   * The anonymous authentication strategy passes authentication for a request, with req.user remaining undefined.
   */
  //  passport.use(new AnonymousStrategy());

  /**
   * LocalStrategy
   *
   * This strategy is used to authenticate users based on a username and password.
   * Anytime a request is made to authorize an application, we must ensure that
   * a user is logged in before asking them to approve the request.
   */
  //  passport.use(
  //      new LocalStrategy((username, password, next) => {
  //          /*
  //      db.users.findByUsername(username)
  //          .then(user => validate.user(user, password))
  //          .then(user => next(null, user))
  //          .catch(() => next(null, false));
  //      */
  //      })
  //  );

  /**
   * BasicStrategy & ClientPasswordStrategy
   *
   * These strategies are used to authenticate registered OAuth clients.  They are
   * employed to protect the `token` endpoint, which consumers use to obtain
   * access tokens.  The OAuth 2.0 specification suggests that clients use the
   * HTTP Basic scheme to authenticate.  Use of the client password strategy
   * allows clients to send the same credentials in the request body (as opposed
   * to the `Authorization` header).  While this approach is not recommended by
   * the specification, in practice it is quite common.
   */
  //  passport.use(
  //      new BasicStrategy((clientId, clientSecret, next) => {
  //          logger.info("#BasicStrategy - clientId: " + clientId);

  //          global.models.GLOBAL.PARTNER.findOne(
  //              {
  //                  "auth.clientId": clientId,
  //                  "auth.clientSecret": clientSecret
  //              },
  //              function (error, partner) {
  //                  if (error) {
  //                      logger.error("#BasicStrategy - Error encountered:\n" + error);
  //                      next(null, false);
  //                  } else if (partner !== null) {
  //                      logger.info("#BasicStrategy - Partner (id: " + partner.id + ", name: " + partner.name + ")");
  //                      partner.type = "partner";
  //                      next(null, partner);
  //                  } else {
  //                      logger.info("#BasicStrategy - No entry found!");
  //                      next(null, false);
  //                  }
  //              });
  //      })
  //  );

  /**
   * Client Password strategy
   *
   * The OAuth 2.0 client password authentication strategy authenticates clients
   * using a client ID and client secret. The strategy requires a verify callback,
   * which accepts those credentials and calls next providing a client.
   */
  //  passport.use(
  //      new ClientPasswordStrategy((clientId, clientSecret, next) => {
  //          /* Not used */
  //      })
  //  );
  /** JWT strategy */
  passport.use(
    new JwtStrategy(jwtOptions, (req, jwt_payload, next) => {
      const {
        id,
        date,
        environment,
        phone,
        scope,
        email,
        type: type,
      } = jwt_payload;
      console.log("JWT PAYLOAD");

      const reqInfo = `REQ [${req.requestId}] [${req.method}] ${req.originalUrl}`;
      logger.info(
        `${reqInfo} - #JwtStrategy - payload: ${JSON.stringify(jwt_payload)}`
      );

      // Do this check only for the USER apps
      if (type === enums.USER_TYPE.USER) {
        if (isEmpty(date)) {
          logger.error(
            '#JwtStrategy - Property "date" is null. User needs to login again!'
          );
          next(null, false);
        }
      }

      let model;
      let criteria;
      console.log("test1", type);

      if (type === enums.USER_TYPE.USER) {
        console.log("test1", type);
        // Check if the token was generated from the same environment - since we are just extracting the phone from the token
        if (
          !isEmpty(environment) &&
          environment !== NODE_ENV &&
          NODE_ENV !== "local"
        ) {
          logger.error("#JwtStrategy - Invalid token!");
          next(null, false);
        }

        model = global.models.GLOBAL.USER;
        // If the phone is not present in the JWT payload then get the user details based on id
        if (isEmpty(phone)) {
          criteria = {
            _id: id,
            "status.name": { $ne: enums.USER_STATUS.DISABLED },
          };
        } else {
          criteria = {
            phone: phone,
            "status.name": { $ne: enums.USER_STATUS.DISABLED },
          };
        }
      } else if (type === enums.USER_TYPE.ADMIN) {
        console.log("test3");

        // Check if the token was generated from the same environment - since we are just extracting the phone from the token
        if (
          !isEmpty(environment) &&
          environment !== NODE_ENV &&
          NODE_ENV !== "local"
        ) {
          logger.error("#JwtStrategy - Invalid token!");
          next(null, false);
        }
        model = global.models.GLOBAL.ADMIN;
        if (isEmpty(phone)) {
          criteria = {
            _id: id,
            "status.name": { $ne: enums.USER_STATUS.DISABLED },
          };
        } else {
          criteria = {
            email: email,
            "status.name": { $ne: enums.USER_STATUS.DISABLED },
          };
        }
      }
      console.log("test4", type, criteria);

      //  logger.info('#JwtStrategy - criteria: ' + JSON.stringify(criteria) + '}' + model);
      model
        .findOne(criteria)
        .lean() // This will return a simple JSON from database - no modifications to database are possible.
        .then((object) => {
          if (!object) {
            logger.info("#JwtStrategy - No entry found!");
            next(null, false);
          } else {
            if (req.headers.authorization.split(" ")[1] == object.latestToken) {
              // logger.info("#JwtStrategy - Entry found!");
              if (type === enums.USER_TYPE.USER) {
                object.scope = scope;
                object.type = type;
                next(null, object);
              } else if (type === enums.USER_TYPE.ADMIN) {
                object.scope = scope;
                object.type = type;
                next(null, object);
              }
            } else {
              logger.info("#JwtStrategy - Token is not valid!");
              next(null, false);
            }
          }
        })
        .catch((error) => {
          logger.error(
            `#JwtStrategy - Error encountered: ${error.message}\n${error.stack}`
          );
          next(null, false);
        });
    })
  );

  /**
   * Register serialization and deserialization functions.
   * When a client redirects a user to user authorization endpoint, an
   * authorization transaction is initiated.  To complete the transaction, the
   * user must authenticate and approve the authorization request.  Because this
   * may involve multiple HTTPS request/response exchanges, the transaction is
   * stored in the session.
   *
   * An application must supply serialization functions, which determine how the
   * client object is serialized into the session.  Typically this will be a
   * simple matter of serializing the client's ID, and deserializing by finding
   * the client by ID from the database.
   */

  //  passport.serializeUser((user, next) => {
  //      // next(null, user.id);
  //  });

  //  passport.deserializeUser((id, next) => {
  //      /*
  //      db.users.find(id)
  //          .then(user => next(null, user))
  //          .catch(err => next(err));
  //          */
  //  });
};
