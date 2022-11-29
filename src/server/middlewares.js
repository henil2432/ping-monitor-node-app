const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const bodyParser = require("body-parser");

const path = require("path");
const cors = require("cors");

const { NODE_ENV = "local" } = process.env;
const isRemote = NODE_ENV !== "local";
var multer = require("multer");
var upload = multer();

module.exports = (app, logger) => {
  /* All middlewares */

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  const corsOpts = {
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  };
  app.use(cors(corsOpts));
  // app.use(express.json({ limit: "10mb" })); // support parsing of application/json type post data
  // app.use(express.urlencoded({ extended: true })); // support parsing of application/x-www-form-urlencoded post data
  app.use(helmet());

  const path2data = path.join(__dirname, "../data");
  logger.info("Path to data: " + path2data);
  app.use("/data", express.static(path2data));

  const path2images = path.join(__dirname, "../assets/img");
  logger.info("Path to images: " + path2images);
  app.use("/images", express.static(path2images));

  const path2styles = path.join(__dirname, "../assets/css");
  logger.info("Path to styles: " + path2styles);
  app.use("/styles", express.static(path2styles));

  /* Middleware - PassportJS */
  app.use(passport.initialize());
  require("../auth/auth").setup();

  const middlewares = require("../middlewares");

  app.use(
    (req, res, next) => {
      //   req = JSON.parse(JSON.stringify(req));

      console.log("req-body---", req.body);
      next();
    },
    middlewares.handleSensitiveRequestParameters,
    middlewares.logIncomingRequest
  );

  // For multi form data
  // app.use(upload.single("uploadFile"));
  // if (isRemote) {
  //     app.use(middlewares.filterIncomingRequest);
  // }

  // const isProduction = process.env.APP_ENVIRONMENT === "PRODUCTION" || process.env.APP_ENVIRONMENT === "PROD";

  // if (isProduction) {
  //     app.use(middlewares.cors);
  // }
};
