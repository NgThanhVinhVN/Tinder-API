"use strict";

const dotenv = require("dotenv");
const assert = require("assert");
const path = require("path");

// environment file error should crash whole process
const ENV_FILE_PATH = path.resolve(".env");
const isEnvFound = dotenv.config({ path: ENV_FILE_PATH });
if (isEnvFound.error) {
    throw new Error("Cannot find .env file.");
}

const { ENV_ENVIROMENT, PORT_SERVER, PORT_CLIENT, MAIN_SOCKET } = process.env;

assert(ENV_ENVIROMENT, "ENV_ENVIROMENT configuration is required.");
assert(PORT_SERVER, "PORT_SERVER configuration is required.");
assert(PORT_CLIENT, "PORT_SERVER configuration is required.");
assert(MAIN_SOCKET, "MAIN_SOCKET configuration is required.");

module.exports = {
    ENV_ENVIROMENT,
    PORT_SERVER,
    PORT_CLIENT,
    MAIN_SOCKET
};
