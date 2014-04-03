var gravatar = require('gravatar');
var common = require('../../../common');
//var glog = require('../../../common').glog;

module.exports = function (req, res, next) {
    if (req.cookies.osserid === undefined) {
        next();
    } else {
        var osser = req.cookies.osserid;
        var ver = osser.ver;
        var uid = osser.uid;
        var clientip = osser.clientip;
        var action = osser.action;

        switch (action) {
        case 'loginned':
            if (!req.session.osser) {
                try {
                    //ip一致判定
                    if (clientip == common.gfunc.getClientIpByProxy(req)) {
                        common.glog.debug(sails, 'ssoログイン');
                        //ssoログイン
                        common.gapi.post(common.gconfig.site.api.security.ssologin, {
                            uid: uid
                        }, function (err, response, body) {
                            if (err) next(err);
                            if (body.result == 'ok') {
                                req.session.osser = common.gfunc.setSSOLoginResult(body);
                            }
                            next();
                        });
                    } else {
                        next();
                    }
                } catch (e) {
                    common.glog.warn(sails, e);
                    common.gfunc.logout(req, res);
                    next();
                }
            } else {
                next();
            }
            break;
        case 'logouted':
            common.glog.debug(sails, 'ssoログアウト');
            common.gfunc.logout(req, res);
            next();
            break;
        default:
            next();
            break;
        }
    }

};