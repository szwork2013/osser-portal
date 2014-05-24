/**
 * AngularController
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
var fs = require('fs');
var _s = require('underscore.string');

module.exports = {


    /**
     * Action blueprints:
     *    `/angular/index`
     *    `/angular`
     */
    index: function (req, res) {
        return res.view('angular/index', {
            layout: 'layout_angular'
        });
    },

    sample: function (req, res) {
        var id = req.param('id');
        //console.log('id', id);
        if (id) {
            if (id.length == 4) {
                var filepath = 'angular/' + id.slice(0, 2) + "/" + id.slice(2, 4);
                fs.readFile('views/' + filepath + '.ejs', function (err, data) {
                    if (err) return console.error(err);
                    return redirect(res, filepath, data.toString());
                });
            } else
                return res.notFound();
        } else
            return res.notFound();
    },

    portlet1: function (req, res) {
        return res.view('angular/portlet/01', {
            layout: ''
        });
    },

    portlet2: function (req, res) {
        return res.view('angular/portlet/02', {
            layout: ''
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to AngularController)
     */
    _config: {}


};

function redirect(res, path, source) {
    //console.log(_s.escapeHTML(source));
    return res.view(path, {
        layout: 'layout_angular',
        source: _s.escapeHTML(source)
    });
}