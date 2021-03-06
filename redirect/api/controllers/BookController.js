/**
 * BookController
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
var common = require('../../../common');

module.exports = {


    /**
     * Action blueprints:
     *    `/book/index`
     *    `/book`
     */
    index: function (req, res) {
        //console.log('redirect.book.index');
        return res.end();
    },

    find: function (req, res) {
        //console.log('redirect.book.find');
        var key = req.param('id');
        if (key) {
            common.glog.info(sails, key);
            if (common.gurl.geturl(key)) {
                return res.redirect(common.gurl.geturl(key));
            } else {
                common.gapi.book.find(key, function (err, response, body) {
                    //console.log(body);
                    if (body.result === 'ok') {
                        return res.redirect(body.book.link);
                    } else {
                        return res.end();
                    }
                });
            }
        } else {
            return res.end();
        }
    },



    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to BookController)
     */
    _config: {}


};