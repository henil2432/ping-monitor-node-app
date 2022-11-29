/**
 * Created by Bhargav Butani on 07.07.2021.
 */
 const { get, isEmpty } = require("lodash");

 const enums = require("../../json/enums.json");
 
 const logger = require("../logger");
 const utils = require("../utils");
 
 module.exports = exports = (path, schema) => async (req, res, next) => {
     if (!["body", "query", "params"].includes(path)) {
         logger.warn(`#validation - checking only body, query or params, but got: ${path}`);
         return next();
     }
     const dataForValidation = get(req, path, null);
     const { value, error } = schema.validate(dataForValidation, { allowUnknown: false, stripUnknown: true });
     if (error) {
         const context = get(error, "details[0].context.message", null);
         logger.error(`#validation - Error encountered at path: "${req.path}", data: ${JSON.stringify(dataForValidation)}, context: ${context}\n${error}`);
         const data4responseObject = {
             req: req,
             result: -1,
             message: String(error),
             payload: context ? { context } : {},
             logPayload: false
         };
         res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4responseObject));
     } else {
         // Overriding sanitized object
         req[path] = value;
         next();
     }
 };
 