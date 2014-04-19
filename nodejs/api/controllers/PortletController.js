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
            limit: 10,
            skip: 0,
            sortOptions: {
                date: -1
            }
        }, function (err, req, body) {
            if (err) {
                console.error(err);
                return res.forbidden();
            } else {
                var form_data = {
                    news: body.results
                };
                console.log(form_data);
                return res.view('partials/rssnews', {
                    gconfig: common.gconfig,
                    gfunc: common.gfunc,
                    form: form_data,
                    layout: ''
                });
            }
        });
    },




    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to PortletController)
     */
    _config: {}


};