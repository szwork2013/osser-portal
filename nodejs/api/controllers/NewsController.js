/**
 * NewsController
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
     *    `/news/index`
     *    `/news`
     */
    index: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'index'
        });
    },


    /**
     * Action blueprints:
     *    `/news/find`
     */
    find: function (req, res) {

        // Send a JSON response
        return res.json({
            hello: 'find'
        });
    },


    /**
     * Action blueprints:
     *    `/news/search`
     */
    search: function (req, res) {
        var pageindex = +req.param('id');
        if (_.isNaN(pageindex)) pageindex = 1;

        common.gapi.feednews.search({
            status: '1',
            limit: common.gconfig.pagesize,
            skip: (pageindex - 1) * common.gconfig.pagesize,
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
                return res.view('portlet/rssnews', {
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
     * (specific to NewsController)
     */
    _config: {}


};