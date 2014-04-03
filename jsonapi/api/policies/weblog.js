var glog = require('../../../common').glog;

module.exports = function (req, res, next) {
    glog.weblog(sails, req);
    next();
};