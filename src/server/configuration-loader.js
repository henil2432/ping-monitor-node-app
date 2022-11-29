const argv = require("yargs").argv;
// const { assign, isEmpty } = require("lodash");

const { NODE_ENV = "local", APP_PORT = "6000" } = process.env

const packageInfo = require("../../package.json");


const loadConfigurationFromFile = async (pathToConfig = "../../config.json", pathToSecretDir = ".") => {
    /* Load the configurations */
    /*
    if (argv._[0] === "up" || argv._[0] === "down") {
        argv._[0] = null;
    }
    */
    const paths = {
        config: pathToConfig,
        secrets: argv._[1] || argv.secret || pathToSecretDir
    };

    // global.config = require(paths.config);
    global.secrets_dir = paths.secrets;

    process.env.APP_ENVIRONMENT = NODE_ENV;
    process.env.APP_NAME = packageInfo.name.toUpperCase();
    process.env.APP_PORT = APP_PORT;
    process.env.APP_RELEASE = packageInfo.name.toUpperCase() + "@" + packageInfo.version;
    process.env.APP_VERSION = packageInfo.version;
};

module.exports = {
    loadConfigurationFromFile,
};
