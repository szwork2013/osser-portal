/**
 * HomeController
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
var sitemap = require('sitemap');
//var common = require('../../../common');

module.exports = {


    /**
     * Action blueprints:
     *    `/home/temp.html`
     */
    temp: function (req, res) {
        return res.view('home/temp', {
            layout: 'layout_angular'
        });
    },

    /**
     * sitemap.xml
     * https://www.npmjs.org/package/sitemap
     * http://www.sitemaps.org/protocol.html
     */
    sitemap: function (req, res) {
        var sm = sitemap.createSitemap({
            hostname: 'http://sample.osser.jp',
            cacheTime: 60 * 1000,
            urls: []
        });

        sm.urls.push({
            url: '/',
            changefreq: 'always',
            priority: 1
        });
        sm.urls.push({
            url: '/angular/',
            changefreq: 'daily',
            priority: 0.9
        });
        sm.urls.push({
            url: '/angular/sample/0900/',
            changefreq: 'daily',
            priority: 0.9
        });
        sm.urls.push({
            url: '/angular/sample/1000/',
            changefreq: 'daily',
            priority: 0.9
        });
        sm.urls.push({
            url: '/angular/sample/1100/',
            changefreq: 'daily',
            priority: 0.9
        });
        sm.urls.push({
            url: '/angular/sample/1200/',
            changefreq: 'daily',
            priority: 0.9
        });
        sm.urls.push({
            url: '/angular/sample/1300/',
            changefreq: 'daily',
            priority: 0.9
        });
        res.header('Content-Type', 'application/xml');
        return res.send(sm.toString());
    },



    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to HomeController)
     */
    _config: {}


};