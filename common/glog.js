var gfunc = require('./gfunc');

function getLogDateTime() {
    var date = new Date();
    return '[' +
        date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' ' +
        date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() +
        '] ';
}
exports.log = function (content) {
    console.log(getLogDateTime() + content);
};
exports.error = function (sails, content) {
    if (sails.log === undefined)
        console.error(getLogDateTime() + content);
    else
        sails.log.error(getLogDateTime() + content);
};
exports.warn = function (sails, content) {
    if (sails.log === undefined)
        console.warn(getLogDateTime() + content);
    else
        sails.log.warn(getLogDateTime() + content);
};
exports.debug = function (sails, content) {
    if (sails.log === undefined)
        console.log(getLogDateTime() + content);
    else
        sails.log.debug(getLogDateTime() + content);
};
exports.info = function (sails, content) {
    if (sails.log === undefined)
        console.info(getLogDateTime() + content);
    else
        sails.log.info(getLogDateTime() + content);
};
exports.verbose = function (sails, content) {
    if (sails.log === undefined)
        console.log(getLogDateTime() + content);
    else
        sails.log.verbose(getLogDateTime() + content);
};

exports.weblog = function (sails, req) {
    if (sails.log === undefined)
        console.info(getLogDateTime() + 'sails==undefined');
    else
        sails.log.info(getLogDateTime() + gfunc.getClientIpByProxy(req) + ' ' + req.method + ' ' + req.path + ' ' + req.headers['user-agent'] + ' ' + req.sessionID);
};