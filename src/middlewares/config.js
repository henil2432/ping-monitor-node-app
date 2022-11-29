require("dotenv").config();
const s3Config = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  region: process.env.region,
  bucket: process.env.bucket,
};
module.exports = {
  s3Config,
};
