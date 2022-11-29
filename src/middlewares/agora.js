const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
require("dotenv");

const appID = process.env.APP_ID;
const appCertificate = process.env.APP_CERTIFICATE;
const role = RtcRole.PUBLISHER;

let functions = {};

functions.generateToken = (channelName) => {
  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    0,
    role
  );
  return token;
};

module.exports = exports = functions;
