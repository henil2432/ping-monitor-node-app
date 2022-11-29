/**
 * MongoDB / Mongoose
 * Created by Bhargav Butani on 06.07.2021
 */
const mongoose = require("mongoose");
const logger = require("../logger");
const ConnectionFactory = require("./connection-factory");
const config = require("../../config.json");

module.exports = async () => {
  mongoose.pluralize(null); // So that mongoose doesn't try to pluralize the schema and map accordingly.
  let models;
  try {
    const connectionFactory = new ConnectionFactory(config);
    // GLOBAL Connections
    const connection_IN_VUAUTOMATION = await connectionFactory.getConnection(
      "GLOBAL",
      config.MONGODB.GLOBAL.DATABASE.VUAUTOMATION
    );

    const mongooseConnections = {
      GLOBAL: {
        VUAUTOMATION: connection_IN_VUAUTOMATION,
      },
    };

    /* All the (mongoose) models to be defined here */
    models = {
      GLOBAL: {
        ADMIN: require("../schema/admin/admin")(connection_IN_VUAUTOMATION),
        ROLE: require("../schema/role/role")(
          mongooseConnections.GLOBAL.VUAUTOMATION
        ),
        DEVICE: require("../schema/device/device")(
          mongooseConnections.GLOBAL.VUAUTOMATION
        ),
      },
    };

    return models;
  } catch (error) {
    logger.error(
      "Error encountered while trying to create database connections and models:\n" +
        error.stack
    );
    return null;
  }
};
