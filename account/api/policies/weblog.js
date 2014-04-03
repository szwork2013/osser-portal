var glog = require('../../../common').glog;

module.exports = function (req, res, next) {
    console.log('account.osserid=' + JSON.stringify(req.cookies.osserid));
    console.log('account.req.session.osser=' + JSON.stringify(req.session.osser));
    glog.weblog(sails, req);
    next();
};