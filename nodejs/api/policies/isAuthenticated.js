/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
var common = require('../../../common');

module.exports = function (req, res, next) {

    if (req.session.osser) {
        return next();
    } else {
        return res.redirect(common.gconfig.url.account + common.gconfig.site.account.route.login);
    }

    return res.forbidden('You are not permitted to perform this action.');
};