/**
 * SampleController
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

module.exports = {

    index: function (req, res) {
        //res.set('Content-Type', 'application/json');
        res.json({
            method: req.method,
            data: req.body,
            param: req.param
        });
    },

    find: function (req, res) {
        //res.set('Content-Type', 'application/json');
        res.json({
            name: 'find',
            method: req.method,
            id: req.param('id')
        });
    },

    create: function (req, res) {
        //res.set('Content-Type', 'application/json');
        res.json({
            name: 'create',
            method: req.method,
            data: req.body
        });
    },

    update: function (req, res) {
        //res.set('Content-Type', 'application/json');
        res.json({
            name: 'update',
            method: req.method,
            id: req.param('id'),
            data: req.body
        });
    },

    destroy: function (req, res) {
        //res.set('Content-Type', 'application/json');
        res.json({
            name: 'destory',
            method: req.method,
            id: req.param('id')
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to SampleController)
     */
    _config: {}


};