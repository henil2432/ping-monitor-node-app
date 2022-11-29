/**
 * Clean/hash request parameters.
 * Created by Bhargav Butani on 08.07.2021.
 */
const { isEmpty } = require("lodash");
const utils = require("../utils");

module.exports = exports = async (req, res, next) => {
  if (
    req.method.toUpperCase() === "POST" ||
    req.method.toUpperCase() === "PUT"
  ) {
    /* Hash all user passwords */
    req.body = JSON.parse(JSON.stringify(req.body));
    Object.keys(req.body).map(function(key, index) {
    if("string" == typeof req.body[key]){
      req.body[key]=req.body[key].trim();
    }
    });
    
    const { oldPassword, newPassword, password } = req.body;
    console.log("password--", password, req.body);

    if (!isEmpty(password) && password.length > 0) {
      req.body.normalPassword = password;
      req.body.password = utils.passwordHash(password);
      console.log("Dpassword--", password);
    }

    if (!isEmpty(oldPassword) && oldPassword.length > 0) {
      req.body.oldPassword = utils.passwordHash(oldPassword);
    }

    if (!isEmpty(newPassword) && newPassword.length > 0) {
      req.body.newPassword = utils.passwordHash(newPassword);
    }
  }

  next();
};
