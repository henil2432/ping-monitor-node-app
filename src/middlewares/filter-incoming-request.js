/**
 * Filter incoming requests
 * Created by Bhargav Butani on 08.07.2021.
 */
 const { isEmpty } = require("lodash");
 const enums = require("../../json/enums");
 const logger = require("../logger");
 
 module.exports = exports = async (req, res, next) => {
     if (req.path === "/") {
         return next();
     }
 
     const headers = {
         [enums.HEADER_PARAMS.CDN_LOOP]: req.header(enums.HEADER_PARAMS.CDN_LOOP),
         [enums.HEADER_PARAMS.CF_CONNECTING_IP]: req.header(enums.HEADER_PARAMS.CF_CONNECTING_IP),
         [enums.HEADER_PARAMS.CF_IP_COUNTRY]: req.header(enums.HEADER_PARAMS.CF_IP_COUNTRY),
         [enums.HEADER_PARAMS.HOST]: req.header(enums.HEADER_PARAMS.HOST)
     };
 
    //  const validRequest =
    //      (/^api(-dev|-test)?.io$/g.test(headers[enums.HEADER_PARAMS.HOST])) && //
    //          headers[enums.HEADER_PARAMS.CDN_LOOP] === "cloudflare" && //
    //          !isEmpty(headers[enums.HEADER_PARAMS.CF_CONNECTING_IP]) && //
    //          !isEmpty(headers[enums.HEADER_PARAMS.CF_IP_COUNTRY]);
    //  if (!validRequest) {
    //      logger.error(`#filterIncomingRequest - Request filtered out. path: ${req.path}, headers: ${JSON.stringify(headers)}`);
    //      return res.status(enums.HTTP_CODES.NOT_FOUND).send("NOT_FOUND");
    //  }
     next();
 };
 