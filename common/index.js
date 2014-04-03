exports.sayHello = function (name) {
    return 'helo ' + name;
};

exports.gconfig = require('./gconfig').config;
exports.gapi = require('./gapi');
exports.glog = require('./glog');
exports.gmsg = require('./gmsg').msg;
exports.gdata = require('./gdata');
exports.gfunc = require('./gfunc');
exports.gmail = require('./gmail');
exports.gurl = require('./gurl');
exports.gmd = require('./gmd');