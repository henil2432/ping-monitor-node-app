module.exports = async (logger) => {
    /* Create the connections and the models */
    const models = await require("../db/connections")();
    if (models) {
        global.models = models;
        logger.info("Database connections and models created successfully!");
        console.log("models", models);
    } else {
        // If the connections and database models are not created, kill the process
        logger.error("Creating database connections and models failed!");
        process.kill(process.pid, "SIGTERM");
    }
};
