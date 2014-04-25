/**
 * PortletController
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
     *    `/portlet/index`
     *    `/portlet`
     */
    index: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'world'
        });
    },


    /**
     * Action blueprints:
     *    `/portlet/rssnews`
     */
    rssnews: function (req, res) {

        common.gapi.feednews.search({
            status: '1',
            limit: 5,
            skip: 0,
            sortOptions: {
                date: -1
            }
        }, function (err, req, body) {
            if (err) {
                console.error(err);
                return res.forbidden();
            } else {
                if (body.result === 'ok') {
                    var form_data = {
                        news: body.results
                    };
                    return res.view('portlet/rssnews', {
                        gconfig: common.gconfig,
                        gfunc: common.gfunc,
                        form: form_data,
                        layout: ''
                    });
                } else {
                    console.error(body);
                    return res.forbidden();
                }
            }
        });
    },

    recentthreads: function (req, res) {
        common.gapi.post(common.gconfig.site.api.thread.search, {
            status: '公開',
            limit: 7,
            skip: 0,
            sortOptions: {
                upddate: -1
            }
        }, function (err, response, body) {
            if (err) {
                console.error(err);
                return res.forbidden();
            } else {
                if (body.result === 'ok') {
                    var form_data = {
                        recentthreads: body.threads
                    };
                    return res.view('portlet/recentthreads', {
                        gconfig: common.gconfig,
                        gfunc: common.gfunc,
                        form: form_data,
                        layout: ''
                    });
                } else {
                    console.error(body);
                    return res.forbidden();
                }
            }
        });
    },

    /**
     * /portlet/buythebook/:id or :alias
     */
    buythebook: function (req, res) {
        var id = req.param('id');
        if (id) {
            common.gapi.book.find(id, function (err, response, body) {
                if (body.result === 'ok') {
                    var form_data = {
                        book: body.book
                    };
                    return res.view('portlet/buythebook', {
                        gconfig: common.gconfig,
                        gfunc: common.gfunc,
                        form: form_data,
                        layout: ''
                    });
                } else {
                    return res.end();
                }
            });
        } else {
            return res.end();
        }
    },


    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to PortletController)
     */
    _config: {}


};