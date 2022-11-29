const { isEmpty } = require("lodash");
const { InvalidArgumentsError } = require("../errors");
const Promise = require("bluebird");
const logger = require("../logger");
const mongoose = require("mongoose");

/* ConnectionFactory */
module.exports = function (config) {
  this.connections = {};

  this.getConnection = async (domain, db) => {
    // logger.info("ConnectionFactory#getConnection - domain: " + domain +  ", db: " + db);
    if (
      isEmpty(domain) ||
      isEmpty(config.MONGODB[domain]) ||
      typeof config.MONGODB[domain] === "undefined" ||
      isEmpty(db) ||
      typeof db === "undefined" ||
      isEmpty(db.NAME)
    ) {
      throw new InvalidArgumentsError("Domain/DB cannot be empty!");
    }

    domain = domain.trim().toUpperCase();
    let connectionName = domain + "#" + db.NAME.trim().toUpperCase();

    // Check if we already created a connection - if yes, return that, else, create a new connection, store and return.
    if (this.connections[connectionName]) {
      logger.info(
        `Connection to database (domain: ${domain}, db: ${db.NAME}) successful!`
      );
      console.log("uil-------------vvv");

      return this.connections[connectionName];
    } else {
      let mongodbUrl = "";
      // if (process.env.APP_ENVIRONMENT.toLowerCase() === "local") {
      //   mongodbUrl = process.env.MONGOURILOCAL;
      // } else {
      mongodbUrl = process.env.MONGOURI;
      // }
      // console.log("uil-------------", process.env.APP_ENVIRONMENT, mongodbUrl);

      let connection = await mongoose.createConnection(
        // `${config.MONGODB[domain].URL}/${db.NAME}`, //* Change to dynamic when database will be live
        `${mongodbUrl}`,
        {
          autoReconnect: true,
          promiseLibrary: Promise,
          reconnectTries: Number.MAX_VALUE,
          useFindAndModify: false,
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
        }
      );

      connection.on("connected", () =>
        logger.info(
          `Connection to database (domain: ${domain}, db: ${db.NAME}) successful!`
        )
      );
      connection.on("error", (error) =>
        logger.error(
          `Connection to database (domain: ${domain}, db: ${db.NAME}) failed! Error: ${error.message}\n${error.stack}`
        )
      );
      connection.on("disconnected", () =>
        logger.info(
          `Connection to database (domain: ${domain}, db: ${db.NAME}) terminated!`
        )
      );

      /* If the Node process ends, close the Mongoose connection */
      process.on("SIGINT", () => {
        connection.close(function () {
          logger.error(
            `Connection to database (domain: ${domain}, db: ${db.NAME}) terminated on SIGINT!`
          );
          process.exit(0);
        });
      });

      this.connections[connectionName] = connection;
      logger.info(
        `Connection to database (domain: ${domain}, db: ${db.NAME}) successful!`
      );

      return this.connections[connectionName];
    }
  };
};
