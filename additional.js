const path = require('path'); // path - working with file and directory paths
const fs = require('fs');
const streamWrite = require('rotating-file-stream');
const uuid = require('node-uuid');
const constants = require('./const_var');
const devLog = devLogDir();
const prodLog = prodLogDir();
module.exports.createLogDir = devLog;
module.exports.createProdLogDir = prodLog;

function prodLogDir() {
    const logDirectory = path.join(__dirname, 'logs');
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
    const stream = streamWrite("prodlogger.log", {
        size: "10M",
        interval: "10d",
        path: logDirectory
    });

    return fs.createWriteStream(constants.PROD_LOG_FILE_PATH, {flags: 'a'});
}
function devLogDir() {
    const logDirectory = path.join(__dirname, 'logs');
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
    const stream = streamWrite("logger.log", {
        size: "10M",
        interval: "10d",
        path: logDirectory
    });

    return fs.createWriteStream(constants.DEV_LOG_FILE_PATH, {flags: 'a'}); //todo вынести путь в отдельную переменную
}

module.exports.assignId = function (req, res, next) {
    req.id = uuid.v4();
    next()
};




