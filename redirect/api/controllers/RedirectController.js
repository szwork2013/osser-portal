/**
 * RedirectController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var validator = require('validator');
var common = require('../../../common');

module.exports = {


    /**
     * Action blueprints:
     *    `http://ip/?q=xxxx
     *    `http://ip/?s=xxxx
     * 引数説明：
     *  q:db検索
     *  s:gurl検索
     */
    index: function (req, res) {
        var q = validator.trim(req.query.q);
        var s = validator.trim(req.query.s);
        if (q) {
            common.glog.info(sails, 'q[' + q + ']->' + common.gurl.geturl(s));
            return res.json({
                hello: 'world',
                q: q,
                s: s
            });
        } else if (s) {
            common.glog.info(sails, 's[' + s + ']->' + common.gurl.geturl(s));
            res.redirect(common.gurl.geturl(s));
        } else {
            res.forbidden();
        }
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to RedirectController)
     */
    _config: {}


};