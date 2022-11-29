/**
 * All the middle-wares to go here.
 * Created by Bhargav Butani on 07.07.2021.
 */
const filterIncomingRequest = require("./filter-incoming-request");
const handleSensitiveRequestParameters = require("./handle-sensitive-request-parameters");
const logIncomingRequest = require("./log-incoming-request");
const validate = require("./validate");

module.exports = exports = {
  cors: async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "DELETE, GET, OPTIONS, POST, PUT"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type, Origin, X-Requested-With"
    );
    next();
  },
  filterIncomingRequest,
  handleSensitiveRequestParameters,
  logIncomingRequest,
  //  removeVersionFromRequestPath: async (req, res, next) => {
  //      const apiVersion = /^\/v[\d]+\//;
  //      req.baseUrl = req.baseUrl.replace(apiVersion, "/");
  //      req.originalUrl = req.originalUrl.replace(apiVersion, "/");
  //      req.path = req.path.replace(apiVersion, "/");
  //      next();
  //  },
  validate,
};
